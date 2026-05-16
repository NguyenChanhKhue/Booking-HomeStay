# JWT Flow

Tài liệu này mô tả flow JWT hiện tại của project `BookingHomeStay` dựa trên code trong `security`, `service`, và `controller`.

## 1. Mục tiêu của flow

- Người dùng đăng ký tài khoản bằng `register`
- Người dùng đăng nhập bằng `login`
- Server tạo JWT sau khi `register` hoặc `login` thành công
- Client gửi JWT trong header `Authorization: Bearer <token>`
- `JwtAuthenticationFilter` đọc token, xác thực token, rồi nạp user vào `SecurityContext`

## 2. Các class tham gia

- `AuthController`: nhận request `/api/auth/register` và `/api/auth/login`
- `AuthService`: xử lý đăng ký, đăng nhập, tạo token
- `JwtService`: tạo và kiểm tra JWT
- `JwtAuthenticationFilter`: đọc Bearer token ở mỗi request
- `CustomUserDetailsService`: load user từ database bằng email
- `SecurityConfig`: cấu hình Spring Security

## 3. Flow register

### Bước 1: Client gọi API register

Endpoint:

```http
POST /api/auth/register
Content-Type: application/json
```

Body ví dụ:

```json
{
  "name": "Nguyen Van A",
  "email": "vana@gmail.com",
  "password": "123456",
  "phoneNumber": "0909123456"
}
```

### Bước 2: `AuthController` nhận request

`AuthController` gọi:

```java
authService.register(request)
```

### Bước 3: `AuthService` xử lý

Trong `AuthService.register()`:

- kiểm tra email đã tồn tại chưa
- mã hóa password bằng `BCryptPasswordEncoder`
- tạo `User`
- gán role mặc định là `UserRole.CUSTOMER`
- lưu user vào database
- tạo JWT bằng `jwtService.generateToken(savedUser)`

Ý chính trong code:

```java
user.setPassword(passwordEncoder.encode(request.getPassword()));
user.setRole(UserRole.CUSTOMER);
User savedUser = userRepository.save(user);
String token = jwtService.generateToken(savedUser);
```

### Bước 4: Server trả response

Ví dụ response:

```json
{
  "statusCode": 201,
  "message": "Register successfully",
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "CUSTOMER",
  "expirationTime": "86400000"
}
```

## 4. Flow login

### Bước 1: Client gọi API login

Endpoint:

```http
POST /api/auth/login
Content-Type: application/json
```

Body ví dụ:

```json
{
  "email": "vana@gmail.com",
  "password": "123456"
}
```

### Bước 2: `AuthService` xác thực tài khoản

`AuthService.login()` gọi:

```java
authenticationManager.authenticate(
    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
```

Ý nghĩa:

- Spring Security sẽ dùng `DaoAuthenticationProvider`
- `DaoAuthenticationProvider` gọi `CustomUserDetailsService`
- `CustomUserDetailsService` tìm user theo email
- password raw từ request sẽ được so với password đã mã hóa trong database

### Bước 3: Tạo JWT

Sau khi xác thực thành công:

- lấy lại user từ database
- gọi `jwtService.generateToken(user)`

### Bước 4: Server trả token

Ví dụ response:

```json
{
  "statusCode": 200,
  "message": "Login successfully",
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "CUSTOMER",
  "expirationTime": "86400000"
}
```

## 5. JWT được tạo như thế nào

Trong `JwtService`:

- secret lấy từ `application.properties`
- expiration hiện tại là `86400000` ms = `24 giờ`
- subject của token là `email`
- claims hiện có thêm `authorities`

Config hiện tại:

```properties
app.jwt.secret=BookingHomeStayJwtSecretKeyForDevOnly1234567890
app.jwt.expiration=86400000
```

Ví dụ phần ý nghĩa payload:

```json
{
  "sub": "vana@gmail.com",
  "authorities": [
    {
      "authority": "ROLE_CUSTOMER"
    }
  ],
  "iat": 1710000000,
  "exp": 1710086400
}
```

Lưu ý:

- `sub` là email người dùng
- `ROLE_CUSTOMER` được sinh từ `User.getAuthorities()`

## 6. Client dùng token như thế nào

Sau khi login thành công, client cần gắn token vào header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

Ví dụ gọi API:

```http
GET /api/bookings/my-bookings
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

## 7. Server xử lý Bearer token như thế nào

`JwtAuthenticationFilter` chạy trước `UsernamePasswordAuthenticationFilter`.

Flow:

1. Lấy header `Authorization`
2. Kiểm tra có bắt đầu bằng `Bearer ` không
3. Cắt token ra
4. Gọi `jwtService.extractUsername(jwt)` để lấy email
5. Gọi `customUserDetailsService.loadUserByUsername(email)` để load user
6. Gọi `jwtService.isTokenValid(jwt, userDetails)` để kiểm tra token
7. Nếu hợp lệ thì set `Authentication` vào `SecurityContextHolder`

Ý chính trong code:

```java
if (jwtService.isTokenValid(jwt, userDetails)) {
  UsernamePasswordAuthenticationToken authToken =
      new UsernamePasswordAuthenticationToken(
          userDetails,
          null,
          userDetails.getAuthorities());

  SecurityContextHolder.getContext().setAuthentication(authToken);
}
```

## 8. Vai trò của `SecurityConfig`

`SecurityConfig` hiện cấu hình:

- tắt CSRF
- dùng session stateless
- gắn `JwtAuthenticationFilter`
- dùng `DaoAuthenticationProvider`

Phần provider:

```java
DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(customUserDetailsService);
authProvider.setPasswordEncoder(passwordEncoder());
```

Ý nghĩa:

- xác thực user bằng dữ liệu trong database
- password sẽ được so sánh bằng `BCryptPasswordEncoder`

## 9. Ví dụ đầy đủ từ đầu đến cuối

### Ví dụ 1: đăng ký

Request:

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Tran Thi B",
  "email": "tranb@gmail.com",
  "password": "abc123",
  "phoneNumber": "0988888888"
}
```

Kết quả:

- database lưu user mới
- password được mã hóa
- role được set là `CUSTOMER`
- response trả về token

### Ví dụ 2: đăng nhập

Request:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "tranb@gmail.com",
  "password": "abc123"
}
```

Kết quả:

- Spring Security xác thực email/password
- nếu đúng, server trả JWT

### Ví dụ 3: dùng token để gọi API khác

Request:

```http
GET /api/rooms
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

Kết quả:

- filter đọc token
- load user theo email trong token
- token hợp lệ thì request có thông tin đăng nhập trong security context

## 10. Lưu ý quan trọng trong code hiện tại

Có một điểm chưa đồng nhất:

- `AuthController` dùng base path: `/api/auth`
- nhưng `SecurityConfig` hiện đang match: `/auth/**`

Nếu bạn muốn mở đúng endpoint auth hiện tại, nên đổi:

```java
.requestMatchers("/api/auth/**", "/rooms/**", "/bookings/**").permitAll()
```

hoặc nếu đang muốn tạm thời cho toàn bộ API truy cập:

```java
.authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
```

## 11. Tóm tắt ngắn

- `register` và `login` đều trả JWT
- JWT chứa `subject = email`
- JWT được gửi lại qua header `Authorization`
- `JwtAuthenticationFilter` xác thực token ở mỗi request
- nếu token hợp lệ, Spring Security xem request là đã đăng nhập


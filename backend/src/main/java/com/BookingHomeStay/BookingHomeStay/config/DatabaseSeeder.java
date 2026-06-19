package com.BookingHomeStay.BookingHomeStay.config;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.BookingHomeStay.BookingHomeStay.entity.Room;
import com.BookingHomeStay.BookingHomeStay.repository.RoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final RoomRepository roomRepository;

    private static final List<String> ALL_AMENITIES = Arrays.asList(
        "Bếp nấu ăn", "Ban công", "Hồ bơi", "Điều hoà", "Bồn tắm",
        "Máy sấy tóc", "Wifi miễn phí", "Khuôn viên vườn", "Chỗ để xe",
        "Máy giặt", "Tiệc BBQ", "Smart TV"
    );

    @Override
    public void run(String... args) throws Exception {
        log.info("Running database seeder...");
        List<Room> existingRooms = roomRepository.findAll();
        
        // 1. Nếu số phòng < 30 thì seed thêm
        if (existingRooms.size() < 30) {
            log.info("Current rooms count is {}. Seeding up to 30 rooms...", existingRooms.size());
            seedRooms(30 - existingRooms.size());
            // Lấy lại danh sách sau khi seed
            existingRooms = roomRepository.findAll();
        }

        // 2. Cập nhật amenities cho các phòng cũ (nếu thiếu)
        boolean isUpdated = false;
        Random random = new Random();
        for (Room room : existingRooms) {
            if (room.getAmenities() == null || room.getAmenities().isEmpty()) {
                room.setAmenities(generateRandomAmenities(random));
                isUpdated = true;
            }
        }

        if (isUpdated) {
            roomRepository.saveAll(existingRooms);
            log.info("Successfully seeded random amenities for existing rooms.");
        } else {
            log.info("All rooms already have amenities. Skipping amenities update.");
        }
    }

    private void seedRooms(int countToSeed) {
        String[] locations = {"Đà Lạt", "Vũng Tàu", "Hội An", "Sa Pa", "Nha Trang"};
        String[] types = {"Phòng Đơn", "Phòng Đôi", "Phòng Gia Đình", "Căn hộ Studio", "Biệt thự mini"};
        String[] imagePool = {
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1502672260266-1c1e5200234a?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1505691938895-1758d7def511?auto=format&fit=crop&w=800&q=80"
        };
        
        Random random = new Random();
        List<Room> newRooms = new java.util.ArrayList<>();
        
        for (int i = 0; i < countToSeed; i++) {
            Room room = new Room();
            String type = types[random.nextInt(types.length)];
            String location = locations[random.nextInt(locations.length)];
            
            room.setRoomType(type);
            room.setRoomLocation(location);
            room.setRoomPrice(new java.math.BigDecimal(500000 + random.nextInt(2500000))); // 500k -> 3tr
            room.setMaxCapacity(2 + random.nextInt(5)); // 2 -> 6 người
            room.setRoomDescription("Trải nghiệm không gian sống lý tưởng tại " + location + ". Nơi tuyệt vời cho kỳ nghỉ của bạn.");
            room.setRoomPhotoUrl(imagePool[random.nextInt(imagePool.length)]);
            room.setAmenities(generateRandomAmenities(random));
            
            newRooms.add(room);
        }
        
        roomRepository.saveAll(newRooms);
        log.info("Seeded {} new rooms successfully.", countToSeed);
    }

    private List<String> generateRandomAmenities(Random random) {
        int numAmenities = 3 + random.nextInt(4); // 3-6 amenities
        List<String> randomAmenities = new java.util.ArrayList<>();
        for (int i = 0; i < numAmenities; i++) {
            String amenity = ALL_AMENITIES.get(random.nextInt(ALL_AMENITIES.size()));
            if (!randomAmenities.contains(amenity)) {
                randomAmenities.add(amenity);
            }
        }
        return randomAmenities;
    }
}

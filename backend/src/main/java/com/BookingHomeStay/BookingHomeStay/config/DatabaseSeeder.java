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
        List<Room> rooms = roomRepository.findAll();
        boolean isUpdated = false;

        Random random = new Random();

        for (Room room : rooms) {
            if (room.getAmenities() == null || room.getAmenities().isEmpty()) {
                // Randomly assign 3 to 6 amenities
                int numAmenities = 3 + random.nextInt(4);
                List<String> randomAmenities = new java.util.ArrayList<>();
                for (int i = 0; i < numAmenities; i++) {
                    String amenity = ALL_AMENITIES.get(random.nextInt(ALL_AMENITIES.size()));
                    if (!randomAmenities.contains(amenity)) {
                        randomAmenities.add(amenity);
                    }
                }
                room.setAmenities(randomAmenities);
                isUpdated = true;
            }
        }

        if (isUpdated) {
            roomRepository.saveAll(rooms);
            log.info("Successfully seeded random amenities for existing rooms.");
        } else {
            log.info("All rooms already have amenities. Skipping seeder.");
        }
    }
}

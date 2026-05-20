ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS room_location VARCHAR(255);

UPDATE rooms SET room_location = 'Đà Lạt' WHERE id = 1;
UPDATE rooms SET room_location = 'Vũng Tàu' WHERE id = 2;
UPDATE rooms SET room_location = 'Hội An' WHERE id = 3;
UPDATE rooms SET room_location = 'Sa Pa' WHERE id = 4;
UPDATE rooms SET room_location = 'Phú Quốc' WHERE id = 5;

UPDATE rooms
SET room_location = 'Việt Nam'
WHERE room_location IS NULL OR TRIM(room_location) = '';

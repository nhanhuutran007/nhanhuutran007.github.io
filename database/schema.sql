-- ===== DATABASE SCHEMA FOR PORTFOLIO =====
-- Database: Portfolio
-- Table: testimonials (đánh giá/reviews)

CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT 'Tên người đánh giá',
  `position` VARCHAR(100) NOT NULL COMMENT 'Chức vụ/Vị trí',
  `content` TEXT NOT NULL COMMENT 'Nội dung đánh giá',
  `avatar_url` VARCHAR(255) DEFAULT NULL COMMENT 'URL ảnh đại diện (optional)',
  `is_approved` TINYINT(1) DEFAULT 0 COMMENT 'Trạng thái duyệt: 0=chưa duyệt, 1=đã duyệt',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật',
  PRIMARY KEY (`id`),
  INDEX `idx_approved` (`is_approved`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ đánh giá từ người dùng';

-- Insert sample data (2 testimonials hiện có)
INSERT INTO `testimonials` (`name`, `position`, `content`, `is_approved`) VALUES
('Ngọc Nhi', 'CTV / Designer', 'Nhan displays exemplary professionalism and is able to take on challenges. I love his.', 1),
('Mẹc siuu', 'Coder Part-Time/ Web Designer', 'Nhan is a great co-worker and problem solver. He is quick to extend his helping hand and makes a good team player.', 1);

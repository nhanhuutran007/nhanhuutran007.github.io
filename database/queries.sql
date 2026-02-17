-- ===== SCRIPT QUẢN TRỊ DATABASE =====
-- Các câu lệnh SQL hữu ích cho việc quản lý testimonials

-- 1. XEM TẤT CẢ TESTIMONIALS
SELECT 
    id,
    name,
    position,
    content,
    is_approved,
    created_at
FROM testimonials
ORDER BY created_at DESC;

-- 2. XEM TESTIMONIALS CHƯA DUYỆT
SELECT * FROM testimonials 
WHERE is_approved = 0 
ORDER BY created_at DESC;

-- 3. XEM TESTIMONIALS ĐÃ DUYỆT
SELECT * FROM testimonials 
WHERE is_approved = 1 
ORDER BY created_at DESC;

-- 4. DUYỆT TESTIMONIAL (thay ID)
UPDATE testimonials 
SET is_approved = 1 
WHERE id = 1;

-- 5. ẨN TESTIMONIAL (thay ID)
UPDATE testimonials 
SET is_approved = 0 
WHERE id = 1;

-- 6. XÓA TESTIMONIAL (thay ID)
DELETE FROM testimonials 
WHERE id = 1;

-- 7. XÓA TẤT CẢ TESTIMONIALS CHƯA DUYỆT
DELETE FROM testimonials 
WHERE is_approved = 0;

-- 8. THỐNG KÊ
SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN is_approved = 1 THEN 1 ELSE 0 END) as approved,
    SUM(CASE WHEN is_approved = 0 THEN 1 ELSE 0 END) as pending
FROM testimonials;

-- 9. XEM TESTIMONIALS MỚI NHẤT (7 ngày)
SELECT * FROM testimonials 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY created_at DESC;

-- 10. TÌM KIẾM THEO TÊN
SELECT * FROM testimonials 
WHERE name LIKE '%keyword%'
ORDER BY created_at DESC;

-- 11. CẬP NHẬT AVATAR CHO TESTIMONIAL (thay ID và URL)
UPDATE testimonials 
SET avatar_url = 'images/avatar-name.jpg' 
WHERE id = 1;

-- 12. BACKUP DỮ LIỆU (export sang file)
-- Chạy trong phpMyAdmin: Export > SQL

-- 13. XÓA TOÀN BỘ DỮ LIỆU (NGUY HIỂM!)
-- TRUNCATE TABLE testimonials;

-- 14. RESET AUTO INCREMENT
-- ALTER TABLE testimonials AUTO_INCREMENT = 1;

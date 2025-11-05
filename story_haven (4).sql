-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 31, 2025 lúc 02:51 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `story_haven`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chapters`
--

CREATE TABLE `chapters` (
  `id` int(11) NOT NULL,
  `story_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `chapter_number` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chapters`
--

INSERT INTO `chapters` (`id`, `story_id`, `title`, `content`, `chapter_number`, `created_at`) VALUES
(4, 3, ' baheT', '\n\n\n-- phpMyAdmin SQL Dump\n\n-- version 5.2.1\n\n-- https://www.phpmyadmin.net/\n\n--\n\n-- Máy chủ: 127.0.0.1\n\n-- Thời gian đã tạo: Th10 09, 2025 lúc 04:16 PM\n\n-- Phiên bản máy phục vụ: 10.4.32-MariaDB\n\n-- Phiên bản PHP: 8.2.12\n\n\n\n\nSET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n\nSTART TRANSACTION;\n\nSET time_zone = \"+00:00\";\n\n\n\n\n\n\n\n/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;\n\n/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;\n\n/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;\n\n/*!40101 SET NAMES utf8mb4 */;\n\n\n\n\n--\n\n-- Cơ sở dữ liệu: `story_haven`\n\n--\n\n\n\n\n-- --------------------------------------------------------\n\n\n\n\n--\n\n-- Cấu trúc bảng cho bảng `chapters`\n\n--\n\n\n\n\nCREATE TABLE `chapters` (\n\n  `id` int(11) NOT NULL,\n\n  `story_id` int(11) NOT NULL,\n\n  `title` varchar(255) NOT NULL,\n\n  `content` text NOT NULL,\n\n  `chapter_number` int(11) NOT NULL,\n\n  `created_at` timestamp NULL DEFAULT current_timestamp()\n\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;\n\n\n\n\n-- --------------------------------------------------------\n\n\n\n\n--\n\n-- Cấu trúc bảng cho bảng `chapter_views`\n\n--\n\n\n\n\nCREATE TABLE `chapter_views` (\n\n  `id` int(11) NOT NULL,\n\n  `chapter_id` int(11) NOT NULL,\n\n  `user_id` int(11) DEFAULT NULL,\n\n  `viewed_at` timestamp NOT NULL DEFAULT current_timestamp()\n\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;\n\n\n\n\n-- --------------------------------------------------------\n\n\n\n\n--\n\n-- Cấu trúc bảng cho bảng `chapter_votes`\n\n--\n\n\n\n\nCREATE TABLE `chapter_votes` (\n\n  `id` int(11) NOT NULL,\n\n  `chapter_id` int(11) NOT NULL,\n\n  `user_id` int(11) NOT NULL,\n\n  `voted_at` timestamp NOT NULL DEFAULT current_timestamp()\n\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;\n\n\n\n\n-- --------------------------------------------------------\n\n\n\n\n--\n\n-- Cấu trúc bảng cho bảng `follows`\n\n--\n\n\n\n\nCREATE TABLE `follows` (\n\n  `id` int(11) NOT NULL,\n\n  `story_id` int(11) NOT NULL,\n\n  `user_id` int(11) NOT NULL,\n\n  `followed_at` timestamp NOT NULL DEFAULT current_timestamp()\n\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;\n\n\n\n\n-- --------------------------------------------------------\n\n\n\n\n--\n\n-- Cấu trúc bảng cho bảng `stories`\n\n--\n\n\n\n\nCREATE TABLE `stories` (\n\n  `id` int(11) NOT NULL,\n\n  `user_id` int(11) NOT NULL,\n\n  `title` varchar(255) NOT NULL,\n\n  `description` text DEFAULT NULL,\n\n  `created_at` timestamp NULL DEFAULT current_timestamp(),\n\n  `thumbnail` varchar(255) DEFAULT NULL,\n\n  `category` varchar(100) DEFAULT NULL,\n\n  `status` enum(\'complete\',\'writing\') DEFAULT \'writing\'\n\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;\n\n\n\n\n--\n\n-- Đang đổ dữ liệu cho bảng `stories`\n\n--\n\n\n\n\nINSERT INTO `stories` (`id`, `user_id`, `title`, `description`, `created_at`, `thumbnail`, `category`, `status`) VALUES\n\n(1, 12, \'Xuyên không rồi phải làm sao đây\', \'Mở MySQL Workbench (MySQL80)\\r\\n\\r\\nKết nối vào Local instance MySQL80 (port 3307).\\r\\n\\r\\nChọn database storyhaven.\\r\\n\\r\\nChuột phải → Data Export.\\r\\n\\r\\nChọn Export to Self-Contained File → lưu file storyhaven.sql.\\r\\n\\r\\nMở phpMyAdmin trong XAMPP (port 3306)\\r\\n\\r\\nTruy cập: http://localhost/phpmyadmin\\r\\n.\\r\\n\\r\\nĐăng nhập tài khoản root (mặc định không có mật khẩu).\\r\\n\\r\\nTạo database mới tên storyhaven.\\r\\n\\r\\nImport dữ liệu vào XAMPP\\r\\n\\r\\nTrong phpMyAdmin → chọn database storyhaven.\\r\\n\\r\\nVào tab Import → chọn file storyhaven.sql → bấm Go.\\r\\n\\r\\nCập nhật kết nối trong Node.js (file mysqlConnect.js)\\r\\nVì XAMPP dùng port 3306, sửa lại:\', \'2025-10-03 09:21:33\', NULL, \'Linh Dị\', \'writing\'),\n\n(3, 13, \'Sau Khi Có Con Ngoài Ý Muốn Với Thái Tử Địch Quốc\', \'Mở MySQL Workbench (MySQL80)\\n\\nKết nối vào Local instance MySQL80 (port 3307).\\n\\nChọn database storyhaven.\\n\\nChuột phải → Data Export.\\n\\nChọn Export to Self-Contained File → lưu file storyhaven.sql.\\n\\nMở phpMyAdmin trong XAMPP (port 3306)\\n\\nTruy cập: http://localhost/phpmyadmin\\n.\\n\\nĐăng nhập tài khoản root (mặc định không có mật khẩu).\\n\\nTạo database mới tên storyhaven.\\n\\nImport dữ liệu vào XAMPP\\n\\nTrong phpMyAdmin → chọn database storyhaven.\\n\\nVào tab Import → chọn file storyhaven.sql → bấm Go.\\n\\nCập nhật kết nối trong Node.js (file mysqlConnect.js)\\nVì XAMPP dùng port 3306, sửa lại:\', \'2025-10-03 09:23:25\', \'/images/story-1759483405108.jpg\', \'Linh dị\', \'writing\'),\n\n(4, 13, \'Conan tập 100\', \'Truyện conan\', \'2025-10-09 13:01:41\', \'/images/story-1760014901303.jpg\', \'Tiên hiệp, Kiếm hiệp, Ngôn tình, Đô thị, Trọng sinh, Xuyên không, Dị giới, Linh dị\', \'writing\');\n\n\n\n\n-- --------------------------------------------------------\n\n\n\n\n--\n\n-- Cấu trúc bảng cho bảng `users`\n\n--\n\n\n\n\nCREATE TABLE `users` (\n\n  `id` int(11) NOT NULL,\n\n  `username` varchar(50) NOT NULL,\n\n  `email` varchar(100) NOT NULL,\n\n  `password` varchar(255) NOT NULL,\n\n  `created_at` timestamp NULL DEFAULT current_timestamp(),\n\n  `phonenumber` varchar(20) NOT NULL\n\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;\n\n\n\n\n--\n\n-- Đang đổ dữ liệu cho bảng `users`\n\n--\n\n\n\n\nINSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`, `phonenumber`) VALUES\n\n(11, \'Phuc Hoang LE\', \'lep61748@gmail.com\', \'$2b$10$A7FJgoZmkOmBCp4aAkqwtOQefsRXLOKo7mICajWN1CNZbyfpP5Hcu\', \'2025-03-04 08:59:28\', \'0372406980\'),\n\n(12, \'BANH nGOT\', \'lephuc.ht2003@gmail.com\', \'$2b$10$.uTKPA8MqWa2.iGxQ8Cp7.rpG2RD5EUD5SGD8vm5M4ohV/lTwr65G\', \'2025-03-04 09:01:42\', \'0372406980\'),\n\n(13, \'Ngọc Mai\', \'ngocmai1@gmail.com\', \'$2b$10$29O8YbZzr70GWZSzrDTOpe2JhrM.B0x/ykZLOa1/rDx6NI.klC0Ga\', \'2025-10-03 09:22:39\', \'0396799601\');\n\n\n\n\n--\n\n-- Chỉ mục cho các bảng đã đổ\n\n--\n\n\n\n\n--\n\n-- Chỉ mục cho bảng `chapters`\n\n--\n\nALTER TABLE `chapters`\n\n  ADD PRIMARY KEY (`id`),\n\n  ADD KEY `story_id` (`story_id`);\n\n\n\n\n--\n\n-- Chỉ mục cho bảng `chapter_views`\n\n--\n\nALTER TABLE `chapter_views`\n\n  ADD PRIMARY KEY (`id`),\n\n  ADD UNIQUE KEY `unique_view` (`chapter_id`,`user_id`),\n\n  ADD KEY `user_id` (`user_id`);\n\n\n\n\n--\n\n-- Chỉ mục cho bảng `chapter_votes`\n\n--\n\nALTER TABLE `chapter_votes`\n\n  ADD PRIMARY KEY (`id`),\n\n  ADD UNIQUE KEY `unique_vote` (`chapter_id`,`user_id`),\n\n  ADD KEY `user_id` (`user_id`);\n\n\n\n\n--\n\n-- Chỉ mục cho bảng `follows`\n\n--\n\nALTER TABLE `follows`\n\n  ADD PRIMARY KEY (`id`),\n\n  ADD UNIQUE KEY `unique_follow` (`story_id`,`user_id`),\n\n  ADD KEY `user_id` (`user_id`);\n\n\n\n\n--\n\n-- Chỉ mục cho bảng `stories`\n\n--\n\nALTER TABLE `stories`\n\n  ADD PRIMARY KEY (`id`),\n\n  ADD KEY `user_id` (`user_id`);\n\n\n\n\n--\n\n-- Chỉ mục cho bảng `users`\n\n--\n\nALTER TABLE `users`\n\n  ADD PRIMARY KEY (`id`),\n\n  ADD UNIQUE KEY `username` (`username`),\n\n  ADD UNIQUE KEY `email` (`email`);\n\n\n\n\n--\n\n-- AUTO_INCREMENT cho các bảng đã đổ\n\n--\n\n\n\n\n--\n\n-- AUTO_INCREMENT cho bảng `chapters`\n\n--\n\nALTER TABLE `chapters`\n\n  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;\n\n\n\n\n--\n\n-- AUTO_INCREMENT cho bảng `chapter_views`\n\n--\n\nALTER TABLE `chapter_views`\n\n  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;\n\n\n\n\n--\n\n-- AUTO_INCREMENT cho bảng `chapter_votes`\n\n--\n\nALTER TABLE `chapter_votes`\n\n  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;\n\n\n\n\n--\n\n-- AUTO_INCREMENT cho bảng `follows`\n\n--\n\nALTER TABLE `follows`\n\n  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;\n\n\n\n\n--\n\n-- AUTO_INCREMENT cho bảng `stories`\n\n--\n\nALTER TABLE `stories`\n\n  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;\n\n\n\n\n--\n\n-- AUTO_INCREMENT cho bảng `users`\n\n--\n\nALTER TABLE `users`\n\n  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;\n\n\n\n\n--\n\n-- Các ràng buộc cho các bảng đã đổ\n\n--\n\n\n\n\n--\n\n-- Các ràng buộc cho bảng `chapters`\n\n--\n\nALTER TABLE `chapters`\n\n  ADD CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `stories` (`id`) ON DELETE CASCADE;\n\n\n\n\n--\n\n-- Các ràng buộc cho bảng `chapter_views`\n\n--\n\nALTER TABLE `chapter_views`\n\n  ADD CONSTRAINT `chapter_views_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE,\n\n  ADD CONSTRAINT `chapter_views_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;\n\n\n\n\n--\n\n-- Các ràng buộc cho bảng `chapter_votes`\n\n--\n\nALTER TABLE `chapter_votes`\n\n  ADD CONSTRAINT `chapter_votes_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE,\n\n  ADD CONSTRAINT `chapter_votes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;\n\n\n\n\n--\n\n-- Các ràng buộc cho bảng `follows`\n\n--\n\nALTER TABLE `follows`\n\n  ADD CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `stories` (`id`) ON DELETE CASCADE,\n\n  ADD CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;\n\n\n\n\n--\n\n-- Các ràng buộc cho bảng `stories`\n\n--\n\nALTER TABLE `stories`\n\n  ADD CONSTRAINT `stories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;\n\nCOMMIT;\n\n\n\n\n/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;\n\n/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;\n\n/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;\n\n\n', 1, '2025-10-09 14:26:02'),
(6, 8, 'Chưa có tiêu đề', 'Thân là một người quân y đặc chủng, cô không theo đuổi thần tượng, chỉ sùng bái anh hùng. Chủ nhân Mặc Cửu Diệp của lăng mộ này, chính là một trong số những anh hùng mà cô ngưỡng mộ.\n\nMặc Cửu Diệp là đệ nhất mãnh tướng dưới triều Đại Thuận, ông đã nhiều lần dẫn đại quân của mình đánh giặc ngoại xâm, khiến cho bọn chúng sợ chết khiếp. Tuy nhiên, chính là một vị anh hùng như vậy, nhưng vì công cao át chủ mà lại làm dấy lên sự kiêng kỵ của Hoàng thượng lúc bấy giờ, đến nỗi cuối cùng ông lại bị cách chức đi lưu đày.\n\n\nThân là một người quân y đặc chủng, cô không theo đuổi thần tượng, chỉ sùng bái anh hùng. Chủ nhân Mặc Cửu Diệp của lăng mộ này, chính là một trong số những anh hùng mà cô ngưỡng mộ.\n\nMặc Cửu Diệp là đệ nhất mãnh tướng dưới triều Đại Thuận, ông đã nhiều lần dẫn đại quân của mình đánh giặc ngoại xâm, khiến cho bọn chúng sợ chết khiếp. Tuy nhiên, chính là một vị anh hùng như vậy, nhưng vì công cao át chủ mà lại làm dấy lên sự kiêng kỵ của Hoàng thượng lúc bấy giờ, đến nỗi cuối cùng ông lại bị cách chức đi lưu đày.', 1, '2025-10-21 08:20:17'),
(7, 8, 'Chương 2', 'Thân là một người quân y đặc chủng, cô không theo đuổi thần tượng, chỉ sùng bái anh hùng. Chủ nhân Mặc Cửu Diệp của lăng mộ này, chính là một trong số những anh hùng mà cô ngưỡng mộ.\n\nMặc Cửu Diệp là đệ nhất mãnh tướng dưới triều Đại Thuận, ông đã nhiều lần dẫn đại quân của mình đánh giặc ngoại xâm, khiến cho bọn chúng sợ chết khiếp. Tuy nhiên, chính là một vị anh hùng như vậy, nhưng vì công cao át chủ mà lại làm dấy lên sự kiêng kỵ của Hoàng thượng lúc bấy giờ, đến nỗi cuối cùng ông lại bị cách chức đi lưu đày.\n\n\nThân là một người quân y đặc chủng, cô không theo đuổi thần tượng, chỉ sùng bái anh hùng. Chủ nhân Mặc Cửu Diệp của lăng mộ này, chính là một trong số những anh hùng mà cô ngưỡng mộ.\n\nMặc Cửu Diệp là đệ nhất mãnh tướng dưới triều Đại Thuận, ông đã nhiều lần dẫn đại quân của mình đánh giặc ngoại xâm, khiến cho bọn chúng sợ chết khiếp. Tuy nhiên, chính là một vị anh hùng như vậy, nhưng vì công cao át chủ mà lại làm dấy lên sự kiêng kỵ của Hoàng thượng lúc bấy giờ, đến nỗi cuối cùng ông lại bị cách chức đi lưu đày.', 2, '2025-10-21 08:20:55');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `follow`
--

CREATE TABLE `follow` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `story_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `stories`
--

CREATE TABLE `stories` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `thumbnail` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `status` enum('complete','writing') DEFAULT 'writing',
  `control` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = bản thảo, 1 = công khai'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `stories`
--

INSERT INTO `stories` (`id`, `user_id`, `title`, `description`, `created_at`, `thumbnail`, `category`, `status`, `control`) VALUES
(1, 12, 'Xuyên không rồi phải làm sao đây', 'Mở MySQL Workbench (MySQL80)\n\nKết nối vào Local instance MySQL80 (port 3307).\n\nChọn database storyhaven.\n\nChuột phải → Data Export.\n\nChọn Export to Self-Contained File → lưu file storyhaven.sql.\n\nMở phpMyAdmin trong XAMPP (port 3306)\n\nTruy cập: http://localhost/phpmyadmin\n.\n\nĐăng nhập tài khoản root (mặc định không có mật khẩu).\n\nTạo database mới tên storyhaven.\n\nImport dữ liệu vào XAMPP\n\nTrong phpMyAdmin → chọn database storyhaven.\n\nVào tab Import → chọn file storyhaven.sql → bấm Go.\n\nCập nhật kết nối trong Node.js (file mysqlConnect.js)\nVì XAMPP dùng port 3306, sửa lại:', '2025-10-03 09:21:33', '/images/story-1760970589151.jpg', '', 'writing', 0),
(3, 13, 'Sau Khi Có Con Ngoài Ý Muốn Với Thái Tử Địch Quốc', 'Mở MySQL Workbench (MySQL80)\n\nKết nối vào Local instance MySQL80 (port 3307).\n\nChọn database storyhaven.\n\nChuột phải → Data Export.\n\nChọn Export to Self-Contained File → lưu file storyhaven.sql.\n\nMở phpMyAdmin trong XAMPP (port 3306)\n\nTruy cập: http://localhost/phpmyadmin\n.\n\nĐăng nhập tài khoản root (mặc định không có mật khẩu).\n\nTạo database mới tên storyhaven.\n\nImport dữ liệu vào XAMPP\n\nTrong phpMyAdmin → chọn database storyhaven.\n\nVào tab Import → chọn file storyhaven.sql → bấm Go.\n\nCập nhật kết nối trong Node.js (file mysqlConnect.js)\nVì XAMPP dùng port 3306, sửa lại:', '2025-10-03 09:23:25', '/images/story-1759483405108.jpg', 'Linh dị', 'writing', 1),
(4, 13, 'Conan tập 100', 'Truyện conan', '2025-10-09 13:01:41', '/images/story-1760014901303.jpg', 'Tiên hiệp, Kiếm hiệp, Ngôn tình, Đô thị, Trọng sinh, Xuyên không, Dị giới, Linh dị', 'writing', 1),
(5, 13, 'Sao xa', 'hd jsgd hd jkuhgd', '2025-10-21 06:19:37', '/images/story-1761027577571.jpg', NULL, 'writing', 1),
(6, 13, 'Trở Lại Thập Niên 70: Gả Cho Nam Xứng Xui Xẻo', 'shdg sdhsh dn dh', '2025-10-21 07:29:00', '/images/story-1761031740467.jpeg', NULL, 'writing', 1),
(8, 14, 'Dấu ấn hoàng gia - tập 9', 'Thân là một người quân y đặc chủng, cô không theo đuổi thần tượng, chỉ sùng bái anh hùng. Chủ nhân Mặc Cửu Diệp của lăng mộ này, chính là một trong số những anh hùng mà cô ngưỡng mộ.\n\nMặc Cửu Diệp là đệ nhất mãnh tướng dưới triều Đại Thuận, ông đã nhiều lần dẫn đại quân của mình đánh giặc ngoại xâm, khiến cho bọn chúng sợ chết khiếp. Tuy nhiên, chính là một vị anh hùng như vậy, nhưng vì công cao át chủ mà lại làm dấy lên sự kiêng kỵ của Hoàng thượng lúc bấy giờ, đến nỗi cuối cùng ông lại bị cách chức đi lưu đày.', '2025-10-21 08:10:19', '/images/story-1761034219386.jpg', 'Ngôn tình, Linh dị, Quân sự, Lịch sử, Dị năng', 'writing', 1),
(9, 14, 'Tôi Lấp Đầy Tủ Lạnh Sinh Tồn Ở Mạt Thế', 'hgshd hgdjmsd ', '2025-10-21 08:11:40', '/images/story-1761034300830.jpg', 'Tiên hiệp, Xuyên không, Huyền huyễn', 'writing', 1),
(10, 14, 'Trở Lại Thập Niên 70: Gả Cho Nam Xứng Xui Xẻo', 'jh shd jshd hsgd', '2025-10-21 08:14:04', '/images/story-1761034444181.jpg', 'Đô thị, Trọng sinh, Khoa học viễn tưởng, Huyền huyễn', 'writing', 1),
(11, 14, 'Boy meets Maria', 'hgjsd  hdsg', '2025-10-21 08:15:45', '/images/story-1761034545774.jpg', 'Lịch sử, Phiêu lưu, Đam mỹ', 'writing', 1),
(12, 14, 'Phàm nhân tu tiên', 'shdg hsgd jhd', '2025-10-21 10:01:49', '/images/story-1761040909715.jpg', 'Phiêu lưu, Đam mỹ', 'writing', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `phonenumber` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`, `phonenumber`) VALUES
(11, 'Phuc Hoang LE', 'lep61748@gmail.com', '$2b$10$A7FJgoZmkOmBCp4aAkqwtOQefsRXLOKo7mICajWN1CNZbyfpP5Hcu', '2025-03-04 08:59:28', '0372406980'),
(12, 'BANH nGOT', 'lephuc.ht2003@gmail.com', '$2b$10$.uTKPA8MqWa2.iGxQ8Cp7.rpG2RD5EUD5SGD8vm5M4ohV/lTwr65G', '2025-03-04 09:01:42', '0372406980'),
(13, 'Ngọc Mai', 'ngocmai1@gmail.com', '$2b$10$29O8YbZzr70GWZSzrDTOpe2JhrM.B0x/ykZLOa1/rDx6NI.klC0Ga', '2025-10-03 09:22:39', '0396799601'),
(14, 'Phương Thảo', 'ngocmai123@gmail.com', '$2b$10$ZOLE9laRLKemoMi3Vno4seR6MNXRT/c501KBxzJmdW/algoP0LUGO', '2025-10-21 08:08:20', 'ngocmai123@gmail.com');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `story_id` (`story_id`);

--
-- Chỉ mục cho bảng `follow`
--
ALTER TABLE `follow`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_follow` (`user_id`,`story_id`),
  ADD KEY `story_id` (`story_id`);

--
-- Chỉ mục cho bảng `stories`
--
ALTER TABLE `stories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `chapters`
--
ALTER TABLE `chapters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `follow`
--
ALTER TABLE `follow`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `stories`
--
ALTER TABLE `stories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `stories` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `follow`
--
ALTER TABLE `follow`
  ADD CONSTRAINT `follow_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `follow_ibfk_2` FOREIGN KEY (`story_id`) REFERENCES `stories` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `stories`
--
ALTER TABLE `stories`
  ADD CONSTRAINT `stories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

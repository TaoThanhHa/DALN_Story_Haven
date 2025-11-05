ALTER TABLE stories 
MODIFY COLUMN control TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0 = bản thảo, 1 = công khai';

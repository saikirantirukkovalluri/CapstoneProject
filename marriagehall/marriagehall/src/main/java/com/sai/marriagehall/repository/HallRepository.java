package com.sai.marriagehall.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sai.marriagehall.entity.Hall;

public interface HallRepository extends JpaRepository<Hall, Long> { }

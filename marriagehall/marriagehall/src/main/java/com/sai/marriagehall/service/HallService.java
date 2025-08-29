package com.sai.marriagehall.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.sai.marriagehall.entity.Hall;
import com.sai.marriagehall.repository.HallRepository;

@Service
public class HallService {

    private final HallRepository hallRepository;

    public HallService(HallRepository hallRepository) {
        this.hallRepository = hallRepository;
    }

    // Get all halls
    public List<Hall> getAllHalls() {
        return hallRepository.findAll();
    }

    // Get a hall by id
    public Optional<Hall> getHallById(Long id) {
        return hallRepository.findById(id);
    }

    // Create or update a hall
    public Hall saveHall(Hall hall) {
        return hallRepository.save(hall);
    }

    // Delete a hall by id
    public void deleteHall(Long id) {
        hallRepository.deleteById(id);
    }
}

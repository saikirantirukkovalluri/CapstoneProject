package com.sai.marriagehall.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sai.marriagehall.entity.Hall;
import com.sai.marriagehall.service.HallService;

@RestController
@RequestMapping("/api/halls")
@CrossOrigin(origins = "http://localhost:4200")
public class HallController {

    private final HallService hallService;

    public HallController(HallService hallService) {
        this.hallService = hallService;
    }

    // Get all halls
    @GetMapping
    public List<Hall> listAll() {
        return hallService.getAllHalls();
    }

    // Get hall by ID
    @GetMapping("/{id}")
    public ResponseEntity<Hall> get(@PathVariable Long id) {
        return hallService.getHallById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new hall
    @PostMapping
    public Hall create(@RequestBody Hall hall) {
        return hallService.saveHall(hall);
    }

    // Update an existing hall
    @PutMapping("/{id}")
    public ResponseEntity<Hall> update(@PathVariable Long id, @RequestBody Hall hallDetails) {
        return hallService.getHallById(id)
                .map(existing -> {
                    existing.setName(hallDetails.getName());
                    existing.setAddress(hallDetails.getAddress());
                    existing.setCapacity(hallDetails.getCapacity());
                    existing.setPricePerDay(hallDetails.getPricePerDay());
                    existing.setDescription(hallDetails.getDescription());
                    return ResponseEntity.ok(hallService.saveHall(existing));
                }).orElse(ResponseEntity.notFound().build());
    }

    // Delete hall by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return hallService.getHallById(id).map(existing -> {
            hallService.deleteHall(id);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}

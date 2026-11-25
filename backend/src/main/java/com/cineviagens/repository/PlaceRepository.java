package com.cineviagens.repository;

import com.cineviagens.model.Place;
import com.cineviagens.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlaceRepository extends JpaRepository<Place, Long> {

    List<Place> findByUserIdOrderByIdDesc(Long userId);

    List<Place> findByUserIdAndStatusOrderByIdDesc(Long userId, Status status);

    Optional<Place> findByIdAndUserId(Long id, Long userId);
}

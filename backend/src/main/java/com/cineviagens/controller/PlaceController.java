package com.cineviagens.controller;

import com.cineviagens.dto.PlaceRequest;
import com.cineviagens.dto.PlaceResponse;
import com.cineviagens.model.Place;
import com.cineviagens.model.Status;
import com.cineviagens.repository.PlaceRepository;
import com.cineviagens.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/** O parâmetro "userId" vem do token JWT: cada usuário só mexe nos próprios lugares. */
@RestController
@RequestMapping("/places")
public class PlaceController {

    private final PlaceRepository places;
    private final UserRepository users;

    public PlaceController(PlaceRepository places, UserRepository users) {
        this.places = places;
        this.users = users;
    }

    @GetMapping
    public List<PlaceResponse> list(@AuthenticationPrincipal Long userId,
                                    @RequestParam(required = false) Status status) {
        List<Place> result = (status == null)
                ? places.findByUserIdOrderByIdDesc(userId)
                : places.findByUserIdAndStatusOrderByIdDesc(userId, status);
        return result.stream().map(PlaceResponse::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlaceResponse create(@AuthenticationPrincipal Long userId,
                                @Valid @RequestBody PlaceRequest req) {
        Place place = new Place();
        place.setUser(users.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado.")));
        fill(place, req);
        return PlaceResponse.from(places.save(place));
    }

    @PutMapping("/{id}")
    public PlaceResponse update(@AuthenticationPrincipal Long userId,
                                @PathVariable Long id,
                                @Valid @RequestBody PlaceRequest req) {
        Place place = find(id, userId);
        fill(place, req);
        return PlaceResponse.from(places.save(place));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        places.delete(find(id, userId));
    }

    private Place find(Long id, Long userId) {
        return places.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lugar não encontrado."));
    }

    private void fill(Place place, PlaceRequest req) {
        place.setPlaceName(req.placeName().trim());
        place.setCountry(req.country().trim());
        place.setMovieTitle(req.movieTitle().trim());
        place.setStatus(req.status());
        place.setNotes(req.notes());
    }
}

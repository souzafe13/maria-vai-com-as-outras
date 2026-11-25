package com.cineviagens.dto;

import com.cineviagens.model.Place;
import com.cineviagens.model.Status;

public record PlaceResponse(
        Long id,
        String placeName,
        String country,
        String movieTitle,
        Status status,
        String notes
) {
    public static PlaceResponse from(Place p) {
        return new PlaceResponse(p.getId(), p.getPlaceName(), p.getCountry(),
                p.getMovieTitle(), p.getStatus(), p.getNotes());
    }
}

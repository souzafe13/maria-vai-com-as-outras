package com.cineviagens.dto;

import com.cineviagens.model.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PlaceRequest(
        @NotBlank(message = "Informe o nome do lugar.") String placeName,
        @NotBlank(message = "Informe o país.") String country,
        @NotBlank(message = "Informe o filme ou a série.") String movieTitle,
        @NotNull(message = "Informe se você já foi ou quer ir.") Status status,
        @Size(max = 500, message = "A observação pode ter no máximo 500 caracteres.") String notes
) {}

package com.generalgivers.foundation.dto.childrenhome;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChildrenHomeRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String location;

    private String city;

    private String town;

    private String village;

    private String contact;

    private String notes;
}

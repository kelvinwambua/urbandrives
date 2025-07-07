package com.urbandrives.app.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.urbandrives.app.dto.BookingRequestDTO;
import com.urbandrives.app.dto.BookingResponseDTO;
import com.urbandrives.app.service.BookingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class BookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BookingService bookingService;

    @Test
    public void createBooking_whenValidInput_returns201() throws Exception {
        BookingRequestDTO bookingRequest = new BookingRequestDTO();
        bookingRequest.setCarId(1L);
        bookingRequest.setCustomerName("Test Customer");
        bookingRequest.setCustomerEmail("test@example.com");
        bookingRequest.setStartDate(LocalDate.now().plusDays(1));
        bookingRequest.setEndDate(LocalDate.now().plusDays(3));

        when(bookingService.createBooking(any(BookingRequestDTO.class))).thenReturn(new BookingResponseDTO());

        mockMvc.perform(post("/public/api/bookings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bookingRequest)))
            .andExpect(status().isCreated());
    }
}

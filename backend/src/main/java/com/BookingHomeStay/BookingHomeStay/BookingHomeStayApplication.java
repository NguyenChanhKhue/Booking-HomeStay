package com.BookingHomeStay.BookingHomeStay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.BookingHomeStay.BookingHomeStay.config.EnvFileLoader;

@SpringBootApplication
public class BookingHomeStayApplication {

	public static void main(String[] args) {
		EnvFileLoader.loadIntoSystemProperties();
		SpringApplication.run(BookingHomeStayApplication.class, args);
	}
}

package com.BookingHomeStay.BookingHomeStay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.BookingHomeStay.BookingHomeStay.config.EnvFileLoader;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class BookingHomeStayApplication {

	public static void main(String[] args) {
		EnvFileLoader.loadIntoSystemProperties();
		SpringApplication.run(BookingHomeStayApplication.class, args);
	}
}

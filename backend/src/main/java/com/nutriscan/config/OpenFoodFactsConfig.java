package com.nutriscan.config;

import com.nutriscan.integration.openfoodfacts.OpenFoodFactsProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestClient;

/** Wires the Open Food Facts {@link RestClient} (base URL + required User-Agent). */
@Configuration
@EnableConfigurationProperties(OpenFoodFactsProperties.class)
public class OpenFoodFactsConfig {

    @Bean
    public RestClient openFoodFactsRestClient(OpenFoodFactsProperties props) {
        return RestClient.builder()
                .baseUrl(props.baseUrl())
                // OFF asks every client to identify itself with a descriptive User-Agent.
                .defaultHeader(HttpHeaders.USER_AGENT, props.userAgent())
                .build();
    }
}

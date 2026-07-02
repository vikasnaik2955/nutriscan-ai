package com.nutriscan.web;

import com.nutriscan.common.error.ResourceNotFoundException;
import com.nutriscan.dto.ProductDto;
import com.nutriscan.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Barcode → cached product lookup (Open Food Facts behind the scenes). Authenticated.
 * The scan/score endpoints (BUILD #5) build on this service.
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/{barcode}")
    public ProductDto getByBarcode(@PathVariable String barcode) {
        return productService.lookupByBarcode(barcode)
                .map(ProductDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("No product found for barcode " + barcode));
    }
}

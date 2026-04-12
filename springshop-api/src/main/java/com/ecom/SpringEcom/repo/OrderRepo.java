package com.ecom.SpringEcom.repo;

import com.ecom.SpringEcom.model.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepo extends JpaRepository<Order, Integer> {
    Optional<Order> findByOrderId(String orderId);

    @EntityGraph(attributePaths = {"orderItems", "orderItems.product"})
    List<Order> findByCustomerNameContainingIgnoreCase(String name);
}

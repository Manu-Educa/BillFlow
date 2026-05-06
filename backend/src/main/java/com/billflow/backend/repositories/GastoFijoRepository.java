package com.billflow.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.billflow.backend.models.GastoFijo;

@Repository
public interface GastoFijoRepository extends JpaRepository<GastoFijo, Long> {
}
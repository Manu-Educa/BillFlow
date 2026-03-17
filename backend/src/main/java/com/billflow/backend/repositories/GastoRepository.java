package com.billflow.backend.repositories;
import com.billflow.backend.models.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
public interface GastoRepository extends JpaRepository<Gasto, Long> {}
package com.billflow.backend.repositories;
import com.billflow.backend.models.Presupuesto;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PresupuestoRepository extends JpaRepository<Presupuesto, Long> {}
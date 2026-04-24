package com.billflow.backend.repositories;

import com.billflow.backend.models.Presupuesto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PresupuestoRepository extends JpaRepository<Presupuesto, Long> {

    // Para cuando Manuel quiera buscar el presupuesto individual
    Presupuesto findByUsuarioId(Long idUsuario);

    // Para cuando Manuel quiera buscar el presupuesto del piso/familia
    Presupuesto findByGrupoId(Long idGrupo);
}
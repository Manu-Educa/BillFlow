package com.billflow.backend.repositories;

import com.billflow.backend.models.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GastoRepository extends JpaRepository<Gasto, Long> {

    // Spring boot permite realizar consultas automaticas con ciertos metodos que tiene por defecto
    /*
    * Explicación para manuel y para mi cuando no me acuerde:
    * Spring boot tiene muchas formas de hacer consultas automáticas sin tener que hacer un SQL
    * En este caso busca un registro que coincida exactamente con el ID del usuario
    * */
    List<Gasto> findByUsuarioId(Long idUsuario);
}
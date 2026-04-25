package com.billflow.backend.services;

import com.billflow.backend.dto.EstadoPresupuestoDTO;
import com.billflow.backend.models.Gasto;
import com.billflow.backend.models.Presupuesto;
import com.billflow.backend.repositories.GastoRepository;
import com.billflow.backend.repositories.PresupuestoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PresupuestoService {

    @Autowired
    private GastoRepository gastoRepository;

    @Autowired
    private PresupuestoRepository presupuestoRepository;

    public EstadoPresupuestoDTO calcularEstado(Long idUsuario) {

        // Guardamos en una lista todos los gastos del usuario
        List<Gasto> listaGastos = gastoRepository.findByUsuarioId(idUsuario);
        Double totalGastado = 0.0;
        LocalDate hoy = LocalDate.now();

        // Sumamos los gastos, solamente de este mes
        for (Gasto gasto : listaGastos) {
            if (gasto.getFecha() != null) {
                boolean mismoMes = (gasto.getFecha().getMonthValue() == hoy.getMonthValue());
                boolean mismoAnio = (gasto.getFecha().getYear() == hoy.getYear());

                if (mismoMes && mismoAnio) {
                    totalGastado = totalGastado + gasto.getImporte();
                }
            }
        }

        // Guardamos el presupuesto que tiene el usuario
        Presupuesto presupuesto = presupuestoRepository.findByUsuarioId(idUsuario);
        Double limite = 0.0;

        if (presupuesto != null && presupuesto.getLimite() != null) {
            limite = presupuesto.getLimite();
        }

// Almacenamos los datos obtenidos anteriormente
        EstadoPresupuestoDTO datosPresupuesto = new EstadoPresupuestoDTO();
        datosPresupuesto.setLimitePresupuesto(limite);
        datosPresupuesto.setGastadoPresupuesto(totalGastado);
        datosPresupuesto.setRestantePresupuesto(limite - totalGastado);

        // Calculo de porcentaje
        if (limite > 0) {
            Double porcentaje = (totalGastado / limite) * 100;
            datosPresupuesto.setPorcentajePresupuesto(porcentaje);
        } else {
            datosPresupuesto.setPorcentajePresupuesto(0.0);
        }

        return datosPresupuesto;
    }
}
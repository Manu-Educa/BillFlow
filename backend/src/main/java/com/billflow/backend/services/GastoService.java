package com.billflow.backend.services;

import com.billflow.backend.dto.GastoDTO;
import com.billflow.backend.models.Gasto;
import com.billflow.backend.repositories.GastoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GastoService {

    @Autowired
    private GastoRepository gastoRepository;

    public List<GastoDTO> GetGastosPreparados(Long idUsuario) {
        
        // Busca los gastos del usuario en la base de datos
        //Los llamo gastos originales por que es el "bruto", para despes convertirlo a DTO
        List<Gasto> listaGastosOriginales = gastoRepository.findByUsuarioId(idUsuario);
        
        // Creamos la lista vacia para almacenar los gastos que sean convertidos a DTO
        List<GastoDTO> listaGastosPreparado = new ArrayList<>();

        // Recorremos los gastos para convertirlos uno a uno e ir almancenandolos en la lista
        for (Gasto gastoOriginal : listaGastosOriginales) {
            
            // Crea el objeto del DTO 
            GastoDTO datosGasto = new GastoDTO();
            
            // Insertamos los datos con el formato deseado
            datosGasto.setIdGasto(gastoOriginal.getId());
            datosGasto.setConceptoGasto(gastoOriginal.getConcepto());
            datosGasto.setImporteGasto(gastoOriginal.getImporte());
            datosGasto.setFechaGasto(gastoOriginal.getFecha());

            // Convierte Categoria a String, si no hay categoria se pondrá: "Sin categoría"
            if (gastoOriginal.getCategoria() != null) {
                datosGasto.setCategoriaGasto(gastoOriginal.getCategoria().getNombre());
            } else {
                datosGasto.setCategoriaGasto("Sin categoría");
            }

            // Añadimos los datos a la lista de los gastos "preparados"
            listaGastosPreparado.add(datosGasto);
        }

        return listaGastosPreparado;
    }
}
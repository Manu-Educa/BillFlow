package com.billflow.backend.dto;

import java.time.LocalDate;

public class GastoDTO {
    // Aplicamos tu regla: [Atributo] + [Gasto]
    private Long idGasto;
    private String conceptoGasto;
    private Double importeGasto;
    private LocalDate fechaGasto;
    
   
    private String categoriaGasto; 

    public Long getIdGasto() {
        return idGasto;
    }

    public String getConceptoGasto() {
        return conceptoGasto;
    }

    public Double getImporteGasto() {
        return importeGasto;
    }

    public LocalDate getFechaGasto() {
        return fechaGasto;
    }

    public String getCategoriaGasto() {
        return categoriaGasto;
    }
    public void setIdGasto(Long idGasto) {
        this.idGasto = idGasto;
    }

    public void setConceptoGasto(String conceptoGasto) {
        this.conceptoGasto = conceptoGasto;
    }

    public void setImporteGasto(Double importeGasto) {
        this.importeGasto = importeGasto;
    }

    public void setFechaGasto(LocalDate fechaGasto) {
        this.fechaGasto = fechaGasto;
    }

    public void setCategoriaGasto(String categoriaGasto) {
        this.categoriaGasto = categoriaGasto;
    }
}
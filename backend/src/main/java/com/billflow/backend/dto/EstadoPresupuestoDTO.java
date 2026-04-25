package com.billflow.backend.dto;

public class EstadoPresupuestoDTO {
    private Double limitePresupuesto;
    private Double gastadoPresupuesto;
    private Double restantePresupuesto;
    private Double porcentajePresupuesto;

    public Double getLimitePresupuesto() {
        return limitePresupuesto;
    }

    public void setLimitePresupuesto(Double limitePresupuesto) {
        this.limitePresupuesto = limitePresupuesto;
    }

    public Double getGastadoPresupuesto() {
        return gastadoPresupuesto;
    }

    public void setGastadoPresupuesto(Double gastadoPresupuesto) {
        this.gastadoPresupuesto = gastadoPresupuesto;
    }

    public Double getRestantePresupuesto() {
        return restantePresupuesto;
    }

    public void setRestantePresupuesto(Double restantePresupuesto) {
        this.restantePresupuesto = restantePresupuesto;
    }

    public Double getPorcentajePresupuesto() {
        return porcentajePresupuesto;
    }

    public void setPorcentajePresupuesto(Double porcentajePresupuesto) {
        this.porcentajePresupuesto = porcentajePresupuesto;
    }
}

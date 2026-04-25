package com.billflow.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "presupuestos")
public class Presupuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double limite;

    @Column(nullable = false)
    private Integer mes;

    @Column(nullable = false)
    private Integer year;

    // --- AQUÍ ESTÁ LA MAGIA DE TU LÓGICA ---
    // Puede ser de un grupo (puede estar vacío si es individual)
    @ManyToOne
    @JoinColumn(name = "id_grupo")
    private Grupo grupo;

    // O puede ser de un usuario (puede estar vacío si es de grupo)
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    // --- GETTERS Y SETTERS ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getLimite() {
        return limite;
    }

    public void setLimite(Double limite) {
        this.limite = limite;
    }

    public Integer getMes() {
        return mes;
    }

    public void setMes(Integer mes) {
        this.mes = mes;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Grupo getGrupo() {
        return grupo;
    }

    public void setGrupo(Grupo grupo) {
        this.grupo = grupo;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
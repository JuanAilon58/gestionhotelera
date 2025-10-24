package com.umg.gestionhotelera.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "folios")
@Getter
@Setter
public class Folio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "estancia_id")
    private Estancia estancia;

    @OneToMany(mappedBy = "folio", cascade = CascadeType.ALL)
    private List<Cargo> cargos;

    private double total;
    private boolean pagado;
}

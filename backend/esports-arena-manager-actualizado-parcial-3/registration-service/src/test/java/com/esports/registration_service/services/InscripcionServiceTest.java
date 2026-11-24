package com.esports.registration_service.services;

import com.esports.registration_service.clients.TeamClient;
import com.esports.registration_service.clients.TournamentClient;
import com.esports.registration_service.exceptions.InscripcionException;
import com.esports.registration_service.models.Inscripcion;
import com.esports.registration_service.models.dtos.InscripcionDTO;
import com.esports.registration_service.models.dtos.TeamResponseDTO;
import com.esports.registration_service.models.dtos.TournamentResponseDTO;
import com.esports.registration_service.repositories.InscripcionRepository;
import net.datafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InscripcionServiceTest {

    @Mock
    private InscripcionRepository inscripcionRepository;

    @Mock
    private TournamentClient tournamentClient;

    @Mock
    private TeamClient teamClient;

    @InjectMocks
    private InscripcionServiceImpl inscripcionService;

    private Inscripcion inscripcionPrueba;
    private InscripcionDTO inscripcionDTO;
    private TournamentResponseDTO torneoActivo;
    private TournamentResponseDTO torneoInactivo;
    private TeamResponseDTO equipoActivo;
    private TeamResponseDTO equipoInactivo;
    private List<Inscripcion> inscripcionList;

    @BeforeEach
    public void setUp() {
        inscripcionPrueba = new Inscripcion();
        inscripcionPrueba.setInscripcionId(1L);
        inscripcionPrueba.setTorneoId(1L);
        inscripcionPrueba.setEquipoId(1L);
        inscripcionPrueba.setFechaInscripcion(LocalDateTime.of(2026, 6, 20, 10, 0));
        inscripcionPrueba.setEstado("ACEPTADA");

        inscripcionDTO = new InscripcionDTO();
        inscripcionDTO.setTorneoId(1L);
        inscripcionDTO.setEquipoId(1L);
        inscripcionDTO.setFechaInscripcion(LocalDateTime.of(2026, 6, 20, 10, 0));
        inscripcionDTO.setEstado("ACEPTADA");

        torneoActivo = new TournamentResponseDTO();
        torneoActivo.setTorneoId(1L);
        torneoActivo.setNombre("Torneo CS2");
        torneoActivo.setJuegoId(1L);
        torneoActivo.setEstado("ACTIVO");

        torneoInactivo = new TournamentResponseDTO();
        torneoInactivo.setTorneoId(2L);
        torneoInactivo.setNombre("Torneo Inactivo");
        torneoInactivo.setJuegoId(1L);
        torneoInactivo.setEstado("INACTIVO");

        equipoActivo = new TeamResponseDTO();
        equipoActivo.setEquipoId(1L);
        equipoActivo.setNombre("Equipo Activo");
        equipoActivo.setEstado("ACTIVO");

        equipoInactivo = new TeamResponseDTO();
        equipoInactivo.setEquipoId(2L);
        equipoInactivo.setNombre("Equipo Inactivo");
        equipoInactivo.setEstado("INACTIVO");

        inscripcionList = new ArrayList<>();
        Faker faker = new Faker(Locale.of("es", "CL"));

        for (int i = 0; i < 100; i++) {
            Inscripcion inscripcion = new Inscripcion();
            inscripcion.setInscripcionId((long) i + 2);
            inscripcion.setTorneoId(1L);
            inscripcion.setEquipoId((long) i + 2);
            inscripcion.setFechaInscripcion(LocalDateTime.of(2026, 6, 20, 10, 0));
            inscripcion.setEstado("ACEPTADA");
            inscripcionList.add(inscripcion);
        }

        inscripcionList.add(inscripcionPrueba);
    }

    @Test
    @DisplayName("Debe listar todas las inscripciones")
    public void shouldFindAllInscripciones() {
        when(inscripcionRepository.findAll()).thenReturn(inscripcionList);

        List<Inscripcion> result = inscripcionService.findAll();

        assertThat(result).hasSize(101);
        assertThat(result).contains(inscripcionPrueba);
        verify(inscripcionRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Debe buscar inscripción por ID")
    public void shouldFindInscripcionById() {
        Long id = 1L;
        when(inscripcionRepository.findById(id)).thenReturn(Optional.of(inscripcionPrueba));

        Inscripcion result = inscripcionService.findById(id);

        assertThat(result).isNotNull();
        assertThat(result.getInscripcionId()).isEqualTo(1L);
        assertThat(result.getEstado()).isEqualTo("ACEPTADA");
        verify(inscripcionRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Debe lanzar excepción al buscar inscripción inexistente")
    public void shouldNotFindInscripcionById() {
        Long id = 999L;
        when(inscripcionRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> inscripcionService.findById(id))
                .isInstanceOf(InscripcionException.class)
                .hasMessage("Inscripción no encontrada");

        verify(inscripcionRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Debe buscar inscripciones por torneoId")
    public void shouldFindInscripcionesByTorneoId() {
        Long torneoId = 1L;
        when(inscripcionRepository.findByTorneoId(torneoId)).thenReturn(inscripcionList);

        List<Inscripcion> result = inscripcionService.findByTorneoId(torneoId);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getTorneoId()).isEqualTo(torneoId);
        verify(inscripcionRepository, times(1)).findByTorneoId(torneoId);
    }

    @Test
    @DisplayName("Debe buscar inscripciones por equipoId")
    public void shouldFindInscripcionesByEquipoId() {
        Long equipoId = 1L;
        when(inscripcionRepository.findByEquipoId(equipoId)).thenReturn(inscripcionList);

        List<Inscripcion> result = inscripcionService.findByEquipoId(equipoId);

        assertThat(result).hasSize(101);
        verify(inscripcionRepository, times(1)).findByEquipoId(equipoId);
    }

    @Test
    @DisplayName("Debe buscar inscripciones por estado")
    public void shouldFindInscripcionesByEstado() {
        String estado = "ACEPTADA";
        when(inscripcionRepository.findByEstado(estado)).thenReturn(inscripcionList);

        List<Inscripcion> result = inscripcionService.findByEstado(estado);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getEstado()).isEqualTo(estado);
        verify(inscripcionRepository, times(1)).findByEstado(estado);
    }

    @Test
    @DisplayName("Debe guardar inscripción si torneo y equipo están activos")
    public void shouldSaveInscripcionWhenTournamentAndTeamAreActive() {
        when(tournamentClient.findById(inscripcionDTO.getTorneoId())).thenReturn(torneoActivo);
        when(teamClient.findById(inscripcionDTO.getEquipoId())).thenReturn(equipoActivo);
        when(inscripcionRepository.existsByTorneoIdAndEquipoId(inscripcionDTO.getTorneoId(), inscripcionDTO.getEquipoId())).thenReturn(false);
        when(inscripcionRepository.save(any(Inscripcion.class))).thenReturn(inscripcionPrueba);

        Inscripcion result = inscripcionService.save(inscripcionDTO);

        assertThat(result).isNotNull();
        assertThat(result.getTorneoId()).isEqualTo(1L);
        assertThat(result.getEquipoId()).isEqualTo(1L);
        verify(tournamentClient, times(1)).findById(inscripcionDTO.getTorneoId());
        verify(teamClient, times(1)).findById(inscripcionDTO.getEquipoId());
        verify(inscripcionRepository, times(1)).existsByTorneoIdAndEquipoId(inscripcionDTO.getTorneoId(), inscripcionDTO.getEquipoId());
        verify(inscripcionRepository, times(1)).save(any(Inscripcion.class));
    }

    @Test
    @DisplayName("Debe lanzar excepción al guardar inscripción si el torneo no está activo")
    public void shouldNotSaveInscripcionWhenTournamentIsInactive() {
        when(tournamentClient.findById(inscripcionDTO.getTorneoId())).thenReturn(torneoInactivo);
        when(teamClient.findById(inscripcionDTO.getEquipoId())).thenReturn(equipoActivo);

        assertThatThrownBy(() -> inscripcionService.save(inscripcionDTO))
                .isInstanceOf(InscripcionException.class)
                .hasMessage("El torneo no está activo");

        verify(tournamentClient, times(1)).findById(inscripcionDTO.getTorneoId());
        verify(teamClient, times(1)).findById(inscripcionDTO.getEquipoId());
        verify(inscripcionRepository, never()).save(any(Inscripcion.class));
    }

    @Test
    @DisplayName("Debe lanzar excepción al guardar inscripción si el equipo no está activo")
    public void shouldNotSaveInscripcionWhenTeamIsInactive() {
        when(tournamentClient.findById(inscripcionDTO.getTorneoId())).thenReturn(torneoActivo);
        when(teamClient.findById(inscripcionDTO.getEquipoId())).thenReturn(equipoInactivo);

        assertThatThrownBy(() -> inscripcionService.save(inscripcionDTO))
                .isInstanceOf(InscripcionException.class)
                .hasMessage("El equipo no está activo");

        verify(tournamentClient, times(1)).findById(inscripcionDTO.getTorneoId());
        verify(teamClient, times(1)).findById(inscripcionDTO.getEquipoId());
        verify(inscripcionRepository, never()).save(any(Inscripcion.class));
    }

    @Test
    @DisplayName("Debe lanzar excepción al guardar inscripción duplicada")
    public void shouldNotSaveInscripcionWhenTeamAlreadyRegistered() {
        when(tournamentClient.findById(inscripcionDTO.getTorneoId())).thenReturn(torneoActivo);
        when(teamClient.findById(inscripcionDTO.getEquipoId())).thenReturn(equipoActivo);
        when(inscripcionRepository.existsByTorneoIdAndEquipoId(inscripcionDTO.getTorneoId(), inscripcionDTO.getEquipoId())).thenReturn(true);

        assertThatThrownBy(() -> inscripcionService.save(inscripcionDTO))
                .isInstanceOf(InscripcionException.class)
                .hasMessage("El equipo ya está inscrito en este torneo");

        verify(inscripcionRepository, times(1)).existsByTorneoIdAndEquipoId(inscripcionDTO.getTorneoId(), inscripcionDTO.getEquipoId());
        verify(inscripcionRepository, never()).save(any(Inscripcion.class));
    }

    @Test
    @DisplayName("Debe actualizar inscripción existente")
    public void shouldUpdateInscripcionById() {
        Long id = 1L;
        InscripcionDTO cambios = new InscripcionDTO();
        cambios.setTorneoId(2L);
        cambios.setEquipoId(2L);
        cambios.setFechaInscripcion(LocalDateTime.of(2026, 7, 1, 11, 0));
        cambios.setEstado("PENDIENTE");

        when(inscripcionRepository.findById(id)).thenReturn(Optional.of(inscripcionPrueba));
        when(inscripcionRepository.save(any(Inscripcion.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Inscripcion result = inscripcionService.updateById(id, cambios);

        assertThat(result.getTorneoId()).isEqualTo(2L);
        assertThat(result.getEquipoId()).isEqualTo(2L);
        assertThat(result.getEstado()).isEqualTo("PENDIENTE");
        verify(inscripcionRepository, times(1)).findById(id);
        verify(inscripcionRepository, times(1)).save(inscripcionPrueba);
    }

    @Test
    @DisplayName("Debe lanzar excepción al actualizar inscripción inexistente")
    public void shouldNotUpdateInscripcionWhenNotExists() {
        Long id = 999L;
        when(inscripcionRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> inscripcionService.updateById(id, inscripcionDTO))
                .isInstanceOf(InscripcionException.class)
                .hasMessage("Inscripción no encontrada");

        verify(inscripcionRepository, times(1)).findById(id);
        verify(inscripcionRepository, never()).save(any(Inscripcion.class));
    }

    @Test
    @DisplayName("Debe eliminar inscripción existente")
    public void shouldDeleteInscripcionById() {
        Long id = 1L;
        when(inscripcionRepository.existsById(id)).thenReturn(true);

        inscripcionService.deleteById(id);

        verify(inscripcionRepository, times(1)).existsById(id);
        verify(inscripcionRepository, times(1)).deleteById(id);
    }

    @Test
    @DisplayName("Debe lanzar excepción al eliminar inscripción inexistente")
    public void shouldNotDeleteInscripcionWhenNotExists() {
        Long id = 999L;
        when(inscripcionRepository.existsById(id)).thenReturn(false);

        assertThatThrownBy(() -> inscripcionService.deleteById(id))
                .isInstanceOf(InscripcionException.class)
                .hasMessage("Inscripción no encontrada");

        verify(inscripcionRepository, times(1)).existsById(id);
        verify(inscripcionRepository, never()).deleteById(id);
    }
}

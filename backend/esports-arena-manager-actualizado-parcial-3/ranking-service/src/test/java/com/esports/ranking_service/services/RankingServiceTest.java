package com.esports.ranking_service.services;

import com.esports.ranking_service.clients.ResultClient;
import com.esports.ranking_service.exceptions.RankingException;
import com.esports.ranking_service.models.Ranking;
import com.esports.ranking_service.models.dtos.RankingDTO;
import com.esports.ranking_service.models.dtos.ResultResponseDTO;
import com.esports.ranking_service.repositories.RankingRepository;
import net.datafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RankingServiceTest {

    @Mock
    private RankingRepository rankingRepository;

    @Mock
    private ResultClient resultClient;

    @InjectMocks
    private RankingServiceImpl rankingService;

    private Ranking rankingPrueba;
    private RankingDTO rankingDTO;
    private ResultResponseDTO resultadoValidado;
    private ResultResponseDTO resultadoNoValidado;
    private List<Ranking> rankingList;

    @BeforeEach
    public void setUp() {
        rankingPrueba = new Ranking();
        rankingPrueba.setRankingId(1L);
        rankingPrueba.setEquipoId(1L);
        rankingPrueba.setTorneoId(1L);
        rankingPrueba.setPuntos(30);
        rankingPrueba.setVictorias(10);
        rankingPrueba.setDerrotas(2);
        rankingPrueba.setPosicion(1);

        rankingDTO = new RankingDTO();
        rankingDTO.setEquipoId(1L);
        rankingDTO.setTorneoId(1L);
        rankingDTO.setPuntos(30);
        rankingDTO.setVictorias(10);
        rankingDTO.setDerrotas(2);
        rankingDTO.setPosicion(1);

        resultadoValidado = new ResultResponseDTO();
        resultadoValidado.setResultadoId(2L);
        resultadoValidado.setEstadoValidacion("REGISTRADO");

        resultadoNoValidado = new ResultResponseDTO();
        resultadoNoValidado.setResultadoId(2L);
        resultadoNoValidado.setEstadoValidacion("PENDIENTE");

        rankingList = new ArrayList<>();
        Faker faker = new Faker(Locale.of("es", "CL"));

        for (int i = 0; i < 100; i++) {
            Ranking ranking = new Ranking();
            ranking.setRankingId((long) i + 2);
            ranking.setEquipoId(1L);
            ranking.setTorneoId(1L);
            ranking.setPuntos(faker.number().numberBetween(1, 100));
            ranking.setVictorias(faker.number().numberBetween(1, 20));
            ranking.setDerrotas(faker.number().numberBetween(0, 10));
            ranking.setPosicion(i + 2);
            rankingList.add(ranking);
        }

        rankingList.add(rankingPrueba);
    }

    @Test
    @DisplayName("Debe listar todos los rankings")
    public void shouldFindAllRankings() {
        when(rankingRepository.findAll()).thenReturn(rankingList);

        List<Ranking> result = rankingService.findAll();

        assertThat(result).hasSize(101);
        assertThat(result).contains(rankingPrueba);
        verify(rankingRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Debe buscar ranking por ID")
    public void shouldFindRankingById() {
        Long id = 1L;
        when(rankingRepository.findById(id)).thenReturn(Optional.of(rankingPrueba));

        Ranking result = rankingService.findById(id);

        assertThat(result).isNotNull();
        assertThat(result.getRankingId()).isEqualTo(1L);
        assertThat(result.getPosicion()).isEqualTo(1);
        verify(rankingRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Debe lanzar excepción al buscar ranking inexistente")
    public void shouldNotFindRankingById() {
        Long id = 999L;
        when(rankingRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> rankingService.findById(id))
                .isInstanceOf(RankingException.class)
                .hasMessage("Ranking no encontrado");

        verify(rankingRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Debe buscar rankings por equipoId")
    public void shouldFindRankingsByEquipoId() {
        Long equipoId = 1L;
        when(rankingRepository.findByEquipoId(equipoId)).thenReturn(rankingList);

        List<Ranking> result = rankingService.findByEquipoId(equipoId);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getEquipoId()).isEqualTo(equipoId);
        verify(rankingRepository, times(1)).findByEquipoId(equipoId);
    }

    @Test
    @DisplayName("Debe buscar rankings por torneoId")
    public void shouldFindRankingsByTorneoId() {
        Long torneoId = 1L;
        when(rankingRepository.findByTorneoId(torneoId)).thenReturn(rankingList);

        List<Ranking> result = rankingService.findByTorneoId(torneoId);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getTorneoId()).isEqualTo(torneoId);
        verify(rankingRepository, times(1)).findByTorneoId(torneoId);
    }

    @Test
    @DisplayName("Debe buscar rankings por posición")
    public void shouldFindRankingsByPosicion() {
        Integer posicion = 1;
        when(rankingRepository.findByPosicion(posicion)).thenReturn(rankingList);

        List<Ranking> result = rankingService.findByPosicion(posicion);

        assertThat(result).hasSize(101);
        verify(rankingRepository, times(1)).findByPosicion(posicion);
    }

    @Test
    @DisplayName("Debe guardar ranking si el resultado está validado")
    public void shouldSaveRankingWhenResultIsValid() {
        when(resultClient.findById(2L)).thenReturn(resultadoValidado);
        when(rankingRepository.save(any(Ranking.class))).thenReturn(rankingPrueba);

        Ranking result = rankingService.save(rankingDTO);

        assertThat(result).isNotNull();
        assertThat(result.getEquipoId()).isEqualTo(1L);
        assertThat(result.getPosicion()).isEqualTo(1);
        verify(resultClient, times(1)).findById(2L);
        verify(rankingRepository, times(1)).save(any(Ranking.class));
    }

    @Test
    @DisplayName("Debe lanzar excepción al guardar ranking si el resultado no está validado")
    public void shouldNotSaveRankingWhenResultIsNotValid() {
        when(resultClient.findById(2L)).thenReturn(resultadoNoValidado);

        assertThatThrownBy(() -> rankingService.save(rankingDTO))
                .isInstanceOf(RankingException.class)
                .hasMessage("El resultado no está validado");

        verify(resultClient, times(1)).findById(2L);
        verify(rankingRepository, never()).save(any(Ranking.class));
    }

    @Test
    @DisplayName("Debe actualizar ranking existente")
    public void shouldUpdateRankingById() {
        Long id = 1L;
        RankingDTO cambios = new RankingDTO();
        cambios.setEquipoId(2L);
        cambios.setTorneoId(2L);
        cambios.setPuntos(40);
        cambios.setVictorias(12);
        cambios.setDerrotas(1);
        cambios.setPosicion(2);

        when(rankingRepository.findById(id)).thenReturn(Optional.of(rankingPrueba));
        when(rankingRepository.save(any(Ranking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Ranking result = rankingService.updateById(id, cambios);

        assertThat(result.getEquipoId()).isEqualTo(2L);
        assertThat(result.getPuntos()).isEqualTo(40);
        assertThat(result.getPosicion()).isEqualTo(2);
        verify(rankingRepository, times(1)).findById(id);
        verify(rankingRepository, times(1)).save(rankingPrueba);
    }

    @Test
    @DisplayName("Debe lanzar excepción al actualizar ranking inexistente")
    public void shouldNotUpdateRankingWhenNotExists() {
        Long id = 999L;
        when(rankingRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> rankingService.updateById(id, rankingDTO))
                .isInstanceOf(RankingException.class)
                .hasMessage("Ranking no encontrado");

        verify(rankingRepository, times(1)).findById(id);
        verify(rankingRepository, never()).save(any(Ranking.class));
    }

    @Test
    @DisplayName("Debe eliminar ranking existente")
    public void shouldDeleteRankingById() {
        Long id = 1L;
        when(rankingRepository.existsById(id)).thenReturn(true);

        rankingService.deleteById(id);

        verify(rankingRepository, times(1)).existsById(id);
        verify(rankingRepository, times(1)).deleteById(id);
    }

    @Test
    @DisplayName("Debe lanzar excepción al eliminar ranking inexistente")
    public void shouldNotDeleteRankingWhenNotExists() {
        Long id = 999L;
        when(rankingRepository.existsById(id)).thenReturn(false);

        assertThatThrownBy(() -> rankingService.deleteById(id))
                .isInstanceOf(RankingException.class)
                .hasMessage("Ranking no encontrado");

        verify(rankingRepository, times(1)).existsById(id);
        verify(rankingRepository, never()).deleteById(id);
    }
}

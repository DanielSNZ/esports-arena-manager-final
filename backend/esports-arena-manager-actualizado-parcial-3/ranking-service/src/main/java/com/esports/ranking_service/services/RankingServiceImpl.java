
package com.esports.ranking_service.services;

import com.esports.ranking_service.exceptions.RankingException;
import com.esports.ranking_service.models.Ranking;
import com.esports.ranking_service.models.dtos.RankingDTO;
import com.esports.ranking_service.repositories.RankingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RankingServiceImpl implements RankingService {

    @Autowired
    private RankingRepository rankingRepository;

    // Obtener todos los rankings
    @Override
    public List<Ranking> findAll() {
        return rankingRepository.findAll();
    }

    // Buscar ranking por ID
    @Override
    public Ranking findById(Long id) {
        return rankingRepository.findById(id)
                .orElseThrow(() ->
                        new RankingException("Ranking no encontrado")
                );
    }

    // Buscar rankings por equipo
    @Override
    public List<Ranking> findByEquipoId(Long equipoId) {
        return rankingRepository.findByEquipoId(equipoId);
    }

    // Buscar rankings por torneo
    @Override
    public List<Ranking> findByTorneoId(Long torneoId) {
        return rankingRepository.findByTorneoId(torneoId);
    }

    // Buscar rankings por posicion
    @Override
    public List<Ranking> findByPosicion(Integer posicion) {
        return rankingRepository.findByPosicion(posicion);
    }

    // Crear un nuevo ranking
    @Override
    public Ranking save(RankingDTO rankingDTO) {

        Ranking ranking = new Ranking();

        ranking.setEquipoId(rankingDTO.getEquipoId());
        ranking.setTorneoId(rankingDTO.getTorneoId());
        ranking.setPuntos(rankingDTO.getPuntos());
        ranking.setVictorias(rankingDTO.getVictorias());
        ranking.setDerrotas(rankingDTO.getDerrotas());
        ranking.setPosicion(rankingDTO.getPosicion());

        return rankingRepository.save(ranking);
    }

    // Actualizar un ranking existente
    @Override
    public Ranking updateById(Long id, RankingDTO rankingDTO) {

        Ranking ranking = rankingRepository.findById(id)
                .orElseThrow(() ->
                        new RankingException("Ranking no encontrado")
                );

        ranking.setEquipoId(rankingDTO.getEquipoId());
        ranking.setTorneoId(rankingDTO.getTorneoId());
        ranking.setPuntos(rankingDTO.getPuntos());
        ranking.setVictorias(rankingDTO.getVictorias());
        ranking.setDerrotas(rankingDTO.getDerrotas());
        ranking.setPosicion(rankingDTO.getPosicion());

        return rankingRepository.save(ranking);
    }

    // Eliminar ranking por ID
    @Override
    public void deleteById(Long id) {

        if (!rankingRepository.existsById(id)) {
            throw new RankingException("Ranking no encontrado");
        }

        rankingRepository.deleteById(id);
    }
}

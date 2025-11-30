import React, { useState, useEffect } from 'react';
import { teamApi } from '../../services/api';
import './ResultsStage.css';

const ResultsStage = ({ teamId }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResults();
  }, [teamId]);

  const loadResults = async () => {
    try {
      const response = await teamApi.getTeamResults(teamId);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка при загрузке результатов');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Загрузка результатов...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!results || !results.statistics) {
    return <div>Результаты пока недоступны</div>;
  }

  return (
    <div className="results-stage">
      <h2>Результаты опроса</h2>

      <div className="statistics-section">
        <h3>Статистика голосования</h3>
        <div className="total-votes">
          Всего голосов: {results.total_votes}
        </div>

        <div className="results-list">
          {results.statistics.map((stat, index) => (
            <div key={stat.answer_id} className="result-item">
              <div className="result-header">
                <span className="result-number">{index + 1}</span>
                <div className="result-content">
                  <div className="result-text">{stat.content}</div>
                  <div className="result-team">Команда: {stat.team_name}</div>
                </div>
              </div>
              <div className="result-stats">
                <div className="votes-count">
                  Голосов: {stat.votes} ({stat.percentage}%)
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
                {stat.voted_teams && stat.voted_teams.length > 0 && (
                  <div className="voted-teams">
                    Проголосовали: {stat.voted_teams.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {results.teams_voting && results.teams_voting.length > 0 && (
        <div className="teams-voting-section">
          <h3>Голоса команд</h3>
          <div className="teams-list">
            {results.teams_voting.map((team) => (
              <div key={team.team_id} className="team-vote">
                <div className="team-name">{team.team_name}</div>
                <div className="team-votes">
                  {team.voted_for.map((vote, index) => (
                    <span key={index} className="vote-tag">
                      {vote}
                    </span>
                  ))}
                </div>
                {team.participants && team.participants.length > 0 && (
                  <div className="team-participants">
                    <h4 className="participants-title">Состав команды:</h4>
                    <div className="participants-list">
                      {team.participants.map((participant) => (
                        <div key={participant.id} className="participant-card">
                          <div className="participant-name">
                            {participant.first_name} {participant.last_name}
                          </div>
                          <div className="participant-info">
                            <div className="participant-profession">
                              <strong>Род деятельности:</strong> {participant.profession}
                            </div>
                            {participant.contact_info && (
                              <div className="participant-contacts">
                                {participant.contact_info.phone && (
                                  <div className="contact-item">
                                    <strong>Телефон:</strong> {participant.contact_info.phone}
                                  </div>
                                )}
                                {participant.contact_info.email && (
                                  <div className="contact-item">
                                    <strong>Email:</strong> {participant.contact_info.email}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsStage;


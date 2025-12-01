import React from 'react';
import './SurveyResults.css';

const SurveyResults = ({ results }) => {
  if (!results || !results.statistics) {
    return <div className="survey-results">Результаты пока недоступны</div>;
  }

  return (
    <div className="survey-results">
      <h3>Статистика опроса</h3>

      <div className="statistics-section">
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

export default SurveyResults;


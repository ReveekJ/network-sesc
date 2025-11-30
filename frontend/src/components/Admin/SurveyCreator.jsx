import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import QRCodeDisplay from './QRCodeDisplay';
import './SurveyCreator.css';

const SurveyCreator = ({ onSurveyCreated, surveyId, onGoToDashboard }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [survey, setSurvey] = useState(null);
  const [error, setError] = useState(null);
  const [activeSurveys, setActiveSurveys] = useState([]);
  const [loadingSurveys, setLoadingSurveys] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState(null);

  useEffect(() => {
    loadActiveSurveys();
  }, []);

  const loadActiveSurveys = async () => {
    setLoadingSurveys(true);
    try {
      // Load both active and draft surveys
      const [activeResponse, draftResponse] = await Promise.all([
        adminApi.getSurveys('active'),
        adminApi.getSurveys('draft')
      ]);
      
      // Combine and deduplicate surveys
      const allSurveys = [
        ...(activeResponse.data || []),
        ...(draftResponse.data || [])
      ];
      
      // Remove duplicates by id
      const uniqueSurveys = allSurveys.filter((survey, index, self) =>
        index === self.findIndex((s) => s.id === survey.id)
      );
      
      setActiveSurveys(uniqueSurveys);
    } catch (err) {
      console.error('Error loading surveys:', err);
    } finally {
      setLoadingSurveys(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await adminApi.createSurvey(title);
      console.log('Survey created response:', response.data); // Debug log
      setSurvey(response.data);
      if (onSurveyCreated) {
        onSurveyCreated(response.data);
      }
      setTitle('');
      // Reload active surveys list
      loadActiveSurveys();
    } catch (err) {
      console.error('Error creating survey:', err); // Debug log
      setError(err.response?.data?.detail || 'Ошибка при создании опроса');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (inviteCode, surveyId) => {
    const link = `${window.location.origin}/survey/${inviteCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLinkId(surveyId);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const handleGoToSurveyDashboard = (surveyId) => {
    // Update parent component state with survey ID
    if (onSurveyCreated) {
      onSurveyCreated({ id: surveyId });
    }
    // Then navigate to dashboard
    if (onGoToDashboard) {
      onGoToDashboard();
    }
  };

  return (
    <div className="survey-creator">
      <h2>Создать опрос</h2>
      
      {activeSurveys.length > 0 && (
        <div className="active-surveys-section">
          <h3>Опросы (активные и черновики)</h3>
          {loadingSurveys ? (
            <div>Загрузка...</div>
          ) : (
            <div className="surveys-list">
              {activeSurveys.map((activeSurvey) => (
                <div key={activeSurvey.id} className="survey-item">
                  <div className="survey-item-info">
                    <div className="survey-item-title">{activeSurvey.title}</div>
                    <div className="survey-item-meta">
                      <span className="status-badge">{activeSurvey.status}</span>
                      <span className="invite-code">Код: {activeSurvey.invite_code}</span>
                    </div>
                  </div>
                  <div className="survey-item-actions">
                    <button
                      className="button button-secondary"
                      onClick={() => handleCopyLink(activeSurvey.invite_code, activeSurvey.id)}
                    >
                      {copiedLinkId === activeSurvey.id ? '✓ Скопировано' : 'Копировать ссылку'}
                    </button>
                    <button
                      className="button button-primary"
                      onClick={() => handleGoToSurveyDashboard(activeSurvey.id)}
                    >
                      Управление
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleCreate}>
        <div>
          <label className="label">Название опроса</label>
          <input
            type="text"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название опроса"
            required
          />
        </div>
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Создание...' : 'Создать опрос'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {survey && (
        <div className="survey-info">
          <h3>✅ Опрос успешно создан!</h3>
          {survey.invite_code ? (
            <>
              <div className="invite-link">
                <label className="label">Пригласительная ссылка:</label>
                <div className="link-container">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/survey/${survey.invite_code}`}
                    className="input"
                  />
                  <button
                    className="button"
                    onClick={() => {
                      const link = `${window.location.origin}/survey/${survey.invite_code}`;
                      navigator.clipboard.writeText(link);
                      alert('Ссылка скопирована в буфер обмена!');
                    }}
                  >
                    Копировать
                  </button>
                </div>
              </div>
              <QRCodeDisplay qrCodeData={survey.qr_code_data} inviteCode={survey.invite_code} />
              {onGoToDashboard && (
                <div style={{ marginTop: '20px' }}>
                  <button
                    className="button"
                    onClick={onGoToDashboard}
                    style={{ width: '100%', backgroundColor: '#007bff', color: 'white' }}
                  >
                    Перейти к управлению опросом
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="error">
              Ошибка: не получен код приглашения. Попробуйте создать опрос еще раз.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SurveyCreator;


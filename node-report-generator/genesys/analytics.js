import { getAnalyticsApi } from './client.js';
import { config } from '../config/env.js';
import { t } from '../config/i18n.js';

/**
 * Builds date range for the last N days
 * @param {number} days - Number of days to look back
 * @returns {Object} Object with startDate and endDate in ISO format
 */
function getDateRange(days = 30) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
}

/**
 * Fetches conversation analytics from Genesys Cloud
 * @param {number} days - Number of days to analyze (default: 30)
 * @returns {Promise<Array>} Array of conversation data
 */
export async function fetchConversationAnalytics(days = 30) {
  try {
    console.log(t('genesys.fetching_conversations', { days }));

    const analyticsApi = await getAnalyticsApi();
    const { startDate, endDate } = getDateRange(days);

    // Build the query body
    const body = {
      interval: `${startDate}/${endDate}`,
      order: 'asc',
      orderBy: 'conversationStart',
      paging: {
        pageSize: 100,
        pageNumber: 1,
      },
      segmentFilters: [
        {
          type: 'and',
          predicates: [
            {
              type: 'dimension',
              dimension: 'mediaType',
              operator: 'matches',
              value: 'voice',
            },
          ],
        },
      ],
    };

    let allConversations = [];
    let pageNumber = 1;
    let hasMorePages = true;

    // Fetch all pages
    while (hasMorePages) {
      body.paging.pageNumber = pageNumber;

      const response = await analyticsApi.postAnalyticsConversationsDetailsQuery(body);

      if (response.conversations && response.conversations.length > 0) {
        allConversations = allConversations.concat(response.conversations);
        console.log(t('genesys.fetched_page', {
          page: pageNumber,
          count: response.conversations.length
        }));
        pageNumber++;

        // Check if there are more pages
        hasMorePages = response.conversations.length === body.paging.pageSize;
      } else {
        hasMorePages = false;
      }

      // Add a small delay to avoid rate limiting
      if (hasMorePages) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(t('genesys.total_conversations', { total: allConversations.length }));
    return allConversations;

  } catch (error) {
    console.error(t('genesys.fetch_error', { message: error.message }));
    throw error;
  }
}

/**
 * Extracts entry points from conversations
 * @param {Array} conversations - Array of conversation objects
 * @returns {Object} Object with entry point statistics
 */
export function analyzeEntryPoints(conversations) {
  const entryPoints = {};
  let totalConversations = 0;

  conversations.forEach(conversation => {
    if (conversation.participants) {
      // Look for the first participant (usually the customer)
      const firstParticipant = conversation.participants.find(p =>
        p.purpose === 'customer' || p.purpose === 'external'
      );

      if (firstParticipant && firstParticipant.sessions) {
        firstParticipant.sessions.forEach(session => {
          if (session.dnis) {
            // DNIS (Dialed Number Identification Service) is the entry point
            const entryPoint = session.dnis || 'Unknown';
            entryPoints[entryPoint] = (entryPoints[entryPoint] || 0) + 1;
            totalConversations++;
          } else if (session.addressFrom) {
            const entryPoint = session.addressFrom || 'Unknown';
            entryPoints[entryPoint] = (entryPoints[entryPoint] || 0) + 1;
            totalConversations++;
          }
        });
      }
    }
  });

  // Calculate percentages and sort
  const entryPointsWithPercentage = Object.entries(entryPoints)
    .map(([entryPoint, count]) => ({
      entryPoint,
      count,
      percentage: ((count / totalConversations) * 100).toFixed(2),
    }))
    .sort((a, b) => b.count - a.count);

  return {
    entryPoints: entryPointsWithPercentage,
    totalConversations,
  };
}

/**
 * Extracts customer journeys from conversations
 * @param {Array} conversations - Array of conversation objects
 * @returns {Object} Object with journey statistics
 */
export function analyzeCustomerJourneys(conversations) {
  const journeys = {};
  let totalJourneys = 0;

  conversations.forEach(conversation => {
    if (conversation.participants) {
      // Build the journey path
      const journeySteps = [];

      conversation.participants.forEach(participant => {
        if (participant.sessions) {
          participant.sessions.forEach(session => {
            // Capture queue names
            if (session.segments) {
              session.segments.forEach(segment => {
                if (segment.queueId && segment.queueName) {
                  journeySteps.push(`Queue:${segment.queueName}`);
                }
                if (segment.segmentType) {
                  journeySteps.push(segment.segmentType);
                }
              });
            }
          });
        }
      });

      if (journeySteps.length > 0) {
        const journeyPath = journeySteps.join(' → ');
        journeys[journeyPath] = (journeys[journeyPath] || 0) + 1;
        totalJourneys++;
      }
    }
  });

  // Calculate percentages and sort
  const journeysWithPercentage = Object.entries(journeys)
    .map(([journey, count]) => ({
      journey,
      count,
      percentage: ((count / totalJourneys) * 100).toFixed(2),
    }))
    .sort((a, b) => b.count - a.count);

  // Limit to top N journeys
  const topJourneys = journeysWithPercentage.slice(0, config.topNJourneys);

  return {
    journeys: topJourneys,
    totalJourneys,
    allJourneysCount: journeysWithPercentage.length,
  };
}

/**
 * Performs complete conversation analysis
 * @param {number} days - Number of days to analyze
 * @returns {Promise<Object>} Complete analysis results
 */
export async function performAnalysis(days = 30) {
  const conversations = await fetchConversationAnalytics(days);

  const entryPointAnalysis = analyzeEntryPoints(conversations);
  const journeyAnalysis = analyzeCustomerJourneys(conversations);

  return {
    dateRange: getDateRange(days),
    conversationCount: conversations.length,
    entryPoints: entryPointAnalysis,
    customerJourneys: journeyAnalysis,
    rawConversations: conversations,
  };
}

import { getConfig } from '../config';
import models from './models';

let cached;

// Should cache the database connection if the connection is shared
if (
  getConfig()
    .DATABASE_INDIVIDUAL_CONNECTIONS_PER_REQUEST === 'true'
) {
  cached = models();
}

/**
 * Initializes the connection to the Database
 */
export function databaseInit() {
  if (cached) {
    return cached;
  }

  return models();
}

/**
 * Closes the connection to the Database if configured to close on each request.
 */
export async function databaseCloseIfIndividualConnectionPerRequest(
  database,
) {
  try {
    if (
      // Must leave the connection open for further requests
      // if not set to individual connection per request
      getConfig()
        .DATABASE_INDIVIDUAL_CONNECTIONS_PER_REQUEST ===
        'true' &&
      database
    ) {
      await database.sequelize.close();
    }
  } catch (error) {
    console.error(error);
  }
}

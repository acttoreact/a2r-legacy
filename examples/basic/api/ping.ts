import * as model from 'a2r/model';
import capitalize from '../tools/capitalize';

/**
 * Sample ping method
 * @returns {Promise<model.PingResult>}
 */
const ping = async (): Promise<model.PingResult> => {
  console.log('ping server method!');
  return {
    result: capitalize('pong'),
  };
};

export default ping;

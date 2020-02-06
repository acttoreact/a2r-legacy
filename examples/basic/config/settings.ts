import { applySettings, Settings } from 'a2r';

/**
 * App settings interface. Must extend A2R Settings
 * @extends {Settings}
 */
interface ProjectSettings extends Settings {
  mySettingKey: string;
}

/**
 * App settings
 */
const settings: ProjectSettings = {
  mySettingKey: 'mySettingValue',
  port: 9000,
};

// The `applySettings` method must be called to set app settings
export default applySettings<ProjectSettings>(settings);

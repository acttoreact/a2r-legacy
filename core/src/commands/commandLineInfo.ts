import colors from 'colors';
import setting from '../config/settings';


export default [
  {
    header: 'A2R Framework',
    content: 'The isomorphic, reactive {italic framework} that scales.'
  },
  {
    content: colors.magenta.bold(`
                  :ooooooooooooooooooooo:\`               \`.:++++++++++++++++++++++++++//:-.\`         
                -ooooooooooooooooooo/.                      -/ooooooooooooooooooooooooooooo+:.      
               .ooooooooooooooooooo\`                          .+oooooooooooooooooooooooooooooo+-    
              \`oooooooooooooooooooo/                           \`+ooooooooooooooooooooooooooooooo+\`  
             \`+ooooooooooooooooooooo/     ${colors.yellow('`.-:///:-`-/-')}         \`ooooooooooooooooooooooooooooooooo\` 
             +oooooooooooooooooo+////\`  ${colors.yellow('`-/oooooooooo+.`')}          :ooooooooooo:.....-:+oooooooooooo: 
            /ooooooooooooooo/-.\`\`....${colors.yellow('-+ooooo+-.-oooo+')}            .ooooooooooo-        :oooooooooooo 
           :ooooooooooooooo+ ${colors.yellow('`/+oooooooooooo-   /ooo:')}            -ooooooooooo-         oooooooooooo 
          -ooooooooooooooooo\` ${colors.yellow('-/ooooooooooooo+/+ooo/')}             /ooooooooooo-        .ooooooooooo+ 
         -ooooooooooooooooooo:  ${colors.yellow('+oooooooooooooooo+-')}             .oooooooooooo-    \`\`.:oooooooooooo- 
        .oooooooooooooooooooo. ${colors.yellow(':ooooooooooooooo+-`')}             \`+ooooooooooooo+++++oooooooooooooo:  
       \`ooooooooooooooooooooo\`${colors.yellow('`.ooooooooooooo:.')}               -oooooooooooooooooooooooooooooooo+-   
      \`+oooooooooooooooooooo${colors.yellow('--o:`/oooooooooo-')}               \`/ooooooooooooooooooooooooooooooo+-\`    
      /oooooooooooooooo/..${colors.yellow('-o/.//- .-...oooo:')}              \`/oooooooooooooooooooooooooooooo+-\`       
     /ooooooooooooooooo:\`  ${colors.yellow('`+o//++///- -++-')}            \`-/ooooooooooooooooooooooooooooooooo-        
    :ooooooooooooooooo:${colors.yellow('`....+')}ooooooooo:.\`\`.         \`-/ooooooooooooooooooooooooooooooooooooo/\`      
   -ooooooooooooooooooooooooooooooooooooooo/      ./ooooooooooooooooooooooooooooooooooooooooo+.     
  .oooooooooooo................-oooooooooooo:    .---------------:ooooooooooo:..../oooooooooooo:    
 \`oooooooooooo-                 -oooooooooooo-                   .ooooooooooo-     -oooooooooooo+\`  
\`+ooooooooooo:                   :oooooooooooo.                  .ooooooooooo-      .ooooooooooooo- 
+ooooooooooo/                     /oooooooooooo\`                 .ooooooooooo-       \`+oooooooooooo/`),
    raw: true,
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'init',
        alias: 'i',
        typeLabel: ' ',
        description: 'Initializes the project for the {underline A2R} {underline Framework}'
      },
      {
        name: 'help',
        alias: 'h',
        typeLabel: ' ',
        description: 'Print this usage guide'
      },
      {
        name: 'dev',
        alias: 'd',
        typeLabel: ' ',
        description: 'Runs in development mode'
      },
      {
        name: 'port',
        alias: 'p',
        typeLabel: '{underline number}',
        description: `Set the port that will be used by the framework ({bold ${
          setting.defaultPort
        }} by default)`
      },
      {
        name: 'frameworkLogLevel',
        alias: 'f',
        typeLabel: '{underline string}',
        description:
          'Set the log level (error, warning, info or verbose) that will be used by the {underline A2R} {underline Framework} ({bold info} by default)'
      }
    ]
  }
];

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
             \`+ooooooooooooooooooooo/     \`.-:///:-\`-/-         \`ooooooooooooooooooooooooooooooooo\` 
             +oooooooooooooooooo+////\` \`-/oooooooooo+.\`          :ooooooooooo:.....-:+oooooooooooo: 
            /ooooooooooooooo/-.\`\`....-+ooooo+-.-oooo+            .ooooooooooo-        :oooooooooooo 
           :ooooooooooooooo+ \`/+oooooooooooo-   /ooo:            -ooooooooooo-         oooooooooooo 
          -ooooooooooooooooo\` -/ooooooooooooo+/+ooo/             /ooooooooooo-        .ooooooooooo+ 
         -ooooooooooooooooooo:  +oooooooooooooooo+-             .oooooooooooo-    \`\`.:oooooooooooo- 
        .oooooooooooooooooooo. :ooooooooooooooo+-\`             \`+ooooooooooooo+++++oooooooooooooo:  
       \`ooooooooooooooooooooo\`\`.ooooooooooooo:.               -oooooooooooooooooooooooooooooooo+-   
      \`+oooooooooooooooooooo--o:\`/oooooooooo-               \`/ooooooooooooooooooooooooooooooo+-\`    
      /oooooooooooooooo/..-o/.//- .-...oooo:              \`/oooooooooooooooooooooooooooooo+-\`       
     /ooooooooooooooooo:\`  \`+o//++///- -++-            \`-/ooooooooooooooooooooooooooooooooo-        
    :ooooooooooooooooo:\`....+ooooooooo:.\`\`.         \`-/ooooooooooooooooooooooooooooooooooooo/\`      
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

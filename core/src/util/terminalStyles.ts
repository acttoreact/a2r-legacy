import colors from 'colors';

export const logo = colors.magenta.bold(`
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
+ooooooooooo/                     /oooooooooooo\`                 .ooooooooooo-       \`+oooooooooooo/`);

export const framework = `${colors.magenta('A2R')} Framework`;
export const watcher = colors.cyan.bold('Watcher');
export const api = colors.yellow.bold('API');
export const sockets = colors.bgYellow.black('Sockets');

export const terminalCommand = (command: string): string => colors.green(command);
export const fullPath = (path: string): string => colors.cyan(path);
export const fileName = (name: string): string => colors.cyan.bold(name);
export const method = (name: string): string => colors.bgWhite.black(name);
chrome.commands.onCommand.addListener(function(command)
{
  console.debug('command is : ' + command);
  if (command == 'reload_extension')
    chrome.runtime.reload();
});
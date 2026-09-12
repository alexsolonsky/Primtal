/** Ambiguous's editor preserves copied code formatting in message content. */
export function messageText(content:string):string {
 const text=content.replace(/\u00a0/g,' ').trim();
 const fenced=text.match(/^```(?:[A-Za-z0-9_-]+)?\r?\n([\s\S]*?)\r?\n```$/);
 if(fenced)return fenced[1].trim();
 const inline=text.match(/^`([^`\r\n]+)`$/);
 if(inline)return inline[1].trim();
 const bold=text.match(/^\*\*([^*\r\n]+)\*\*$/);
 return bold?bold[1].trim():text;
}

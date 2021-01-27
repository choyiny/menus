#!/bin/sh

# loops over file
section=""
echo "Name,Description,Price,Sections,Section Subtitle,Section Description,Tags,Section Image"
while read line; do
  i=0
  title=""
  description=""
  amount=""
  if ! [[ ${line::1} =~ ^[0-9]+$ ]]; then
    section=${line}
  else 
    for word in $line
    do
        if [ $i -lt 2 ]; then
            if [ $i -eq 0 ]; then
                title=${word}" " 
            else
                title="${title}"${word}
            fi  
            true $(( i++ ))
        else
            if [[ ${word::1} == "$" ]] ; then
                amount=${word}
            else 
                description=${description}" "${word}
            fi
        fi
    done
      echo ${title}','${description}','${amount}','${section}',,,'
  fi
done < realinput.txt
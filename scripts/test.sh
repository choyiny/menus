#!/bin/sh

# loops over file
while read line; do
  i=0
  title=""
  description=""
  amount=""
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
  echo "-------------"
  echo "Menu item"
  echo $title
  echo $description
  echo $amount
done < input.txt
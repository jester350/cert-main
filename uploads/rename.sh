#!/bin/bash
for d in $*; do
	    for f in $(ls $d/*.kevs); do
		            echo $(date) $(mv -v $f ${f%.kevs}.bobs)
			        done
			done

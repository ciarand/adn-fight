SCSSC=scss
SCSS_BASE=scss
SCSS_PATHS=-I ${SCSS_BASE}/bourbon/ -I ${SCSS_BASE}/neat/\
		   -I ${SCSS_BASE}/base/
SCSS_FLAGS=${SCSS_PATHS}

watch:
	${SCSSC} ${SCSS_FLAGS} --watch ${SCSS_BASE}:css/

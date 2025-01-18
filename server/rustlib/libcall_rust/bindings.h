#include <stdarg.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>

typedef struct String String;

void free_str(char *s);

const char *hello(const char *name);

const char *a3encrypt(char *input);

const char *a3decrypt(char *input);

struct String get_middleware_version(void);

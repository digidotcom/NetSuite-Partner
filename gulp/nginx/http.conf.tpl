server {
    listen <%= http_port || 7777 %> default_server; # PS: changed port to dynamic
    listen [::]:<%= http_port || 7777 %> default_server ipv6only=on; # PS: changed port to dynamic

    root <%= localDistributionPath %>;
    server_name localhost;

    location / {
        add_header Access-Control-Allow-Origin *;
        try_files $uri $uri/ =404;
        autoindex on;
    }

    location /Modules {
        add_header Access-Control-Allow-Origin *;
        alias ../../Modules;
        autoindex on;
    }
}

import { main } from './src/index';

const clear = () => {
    document.body.innerHTML = '';
    main()
}

main()